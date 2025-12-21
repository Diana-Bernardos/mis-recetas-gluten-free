require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.SPOONACULAR_API_KEY;

app.use(cors());
app.use(express.json());

// Helper to format local recipes
const formatLocalRecipe = (row) => ({
  id: row.id,
  title: row.title,
  image: row.image || 'https://via.placeholder.com/300?text=No+Image',
  ingredients: row.ingredients,
  instructions: row.instructions,
  source: 'local'
});

// GET /api/recipes - Get all local recipes
app.get('/api/recipes', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM recipes ORDER BY id DESC');
    const rows = stmt.all();
    res.json(rows.map(formatLocalRecipe));
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// GET /api/recipes/:id - Get a single recipe
app.get('/api/recipes/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM recipes WHERE id = ?');
    const row = stmt.get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Recipe not found' });
    res.json(formatLocalRecipe(row));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

// POST /api/recipes - Create a new recipe
app.post('/api/recipes', (req, res) => {
  try {
    const { title, ingredients, instructions, image } = req.body;
    if (!title || !ingredients || !instructions) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const stmt = db.prepare('INSERT INTO recipes (title, ingredients, instructions, image) VALUES (?, ?, ?, ?)');
    const info = stmt.run(title, ingredients, instructions, image || null);
    res.status(201).json({ id: info.lastInsertRowid, title, ingredients, instructions, image, source: 'local' });
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
});

// GET /api/search - Search Spoonacular + Local
app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json([]);

  let results = [];

  // 1. Search Local
  try {
    const stmt = db.prepare('SELECT * FROM recipes WHERE title LIKE ?');
    const localRows = stmt.all(`%${query}%`);
    results = localRows.map(formatLocalRecipe);
  } catch (err) {
    console.error('Local search error:', err);
  }

  // 2. Search TheMealDB (Free Public API)
  try {
    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    
    if (response.data.meals) {
       const apiRecipes = response.data.meals.map(r => {
          // TheMealDB ingredients are spread across strIngredient1, strIngredient2...
          let ingredients = [];
          for (let i = 1; i <= 20; i++) {
             if (r[`strIngredient${i}`]) {
                ingredients.push(`${r[`strMeasure${i}`]} ${r[`strIngredient${i}`]}`.trim());
             }
          }

          return {
            id: r.idMeal,
            title: r.strMeal,
            image: r.strMealThumb,
            ingredients: ingredients.join('\n'),
            instructions: r.strInstructions || 'Ver instrucciones en la web.',
            source: 'themealdb'
          };
       });
       results = [...results, ...apiRecipes];
    }

  } catch (err) {
    console.error('TheMealDB search error:', err.message);
  }

  if (!res.headersSent) {
    res.json(results);
  }
});

// --- SHOPPING LIST API ---

app.get('/api/shopping-list', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM shopping_list ORDER BY id DESC');
    res.json(stmt.all());
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch list' });
  }
});

app.post('/api/shopping-list', (req, res) => {
  try {
    const { item, quantity } = req.body;
    const stmt = db.prepare('INSERT INTO shopping_list (item, quantity) VALUES (?, ?)');
    const info = stmt.run(item, quantity || '1');
    res.json({ id: info.lastInsertRowid, item, quantity, checked: 0 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item' });
  }
});

app.delete('/api/shopping-list/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM shopping_list WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

app.put('/api/shopping-list/:id/check', (req, res) => {
  try {
    const { checked } = req.body; // boolean
    const stmt = db.prepare('UPDATE shopping_list SET checked = ? WHERE id = ?');
    stmt.run(checked ? 1 : 0, req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// --- ASSISTANT API ---

app.post('/api/assistant', async (req, res) => {
  const { query } = req.body;
  const lowerQuery = query.toLowerCase();
  
  // Logic 1: Add to shopping list
  if (lowerQuery.includes('compra') || lowerQuery.includes('lista') || lowerQuery.includes('anotar')) {
      if (lowerQuery.includes('añade') || lowerQuery.includes('implantar') || lowerQuery.includes('pon')) {
         // Simple extraction logic (naive)
         const words = query.split(' ');
         const itemIndex = words.findIndex(w => ['añade', 'pon', 'comprar'].some(k => w.toLowerCase().includes(k)));
         const item = words.slice(itemIndex + 1).join(' ').replace('a la lista', '').trim();
         
         if (item) {
            const stmt = db.prepare('INSERT INTO shopping_list (item) VALUES (?)');
            stmt.run(item);
            return res.json({ answer: `He añadido "${item}" a tu lista de la compra.` });
         }
      }
      return res.json({ answer: 'Puedo gestionar tu lista de la compra. Dime "Añade pan" para empezar.' });
  }

  // Logic 2: Suggest Menu
  if (lowerQuery.includes('menú') || lowerQuery.includes('sugerencia') || lowerQuery.includes('comer') || lowerQuery.includes('cenar')) {
      const stmt = db.prepare('SELECT title FROM recipes ORDER BY RANDOM() LIMIT 3');
      const recipes = stmt.all();
      if (recipes.length > 0) {
          const titles = recipes.map(r => r.title).join(', ');
          return res.json({ answer: `Aquí tienes una sugerencia de menú basada en tus recetas: ${titles}.` });
      }
      return res.json({ answer: 'Aún no tienes recetas suficientes para sugerir un menú. ¡Crea algunas primero!' });
  }

  // Logic 3: Recipe Search Question
  if (lowerQuery.includes('tengo') || lowerQuery.includes('hacer')) {
     const stmt = db.prepare('SELECT title FROM recipes');
     const allRecipes = stmt.all();
     // Simple search
     const found = allRecipes.filter(r => lowerQuery.includes(r.title.toLowerCase()));
     if (found.length > 0) {
        return res.json({ answer: `Sí, tienes estas recetas relacionadas: ${found.map(f => f.title).join(', ')}.` });
     }
  }

  return res.json({ answer: 'No estoy seguro de entenderte. Prueba a pedirme "Sugiereme un menú" o "Añade manzanas a la lista".' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
