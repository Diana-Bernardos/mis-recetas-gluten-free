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

// --- ASSISTANT API WITH OLLAMA ---

app.post('/api/assistant', async (req, res) => {
  const { query } = req.body;
  
  try {
    // 1. Gather Context
    const recipes = db.prepare('SELECT title, ingredients FROM recipes').all();
    const shoppingList = db.prepare('SELECT item FROM shopping_list').all();
    
    // Format context for the LLM
    const recipesContext = recipes.map(r => `- ${r.title} (Ingredientes: ${r.ingredients.substring(0, 50)}...)`).join('\n');
    const listContext = shoppingList.map(i => `- ${i.item}`).join('\n') || '(Lista vacía)';

    const systemPrompt = `
Eres un asistente de cocina útil y amable para una aplicación de "Recetas Sin Gluten".
Tu objetivo es ayudar al usuario a planificar sus comidas y organizar su lista de la compra.

INFORMACIÓN ACTUAL:
[Mis Recetas]:
${recipesContext}

[Lista de la Compra]:
${listContext}

INSTRUCCIONES CLAVE:
1. Si el usuario te pide AÑADIR algo a la lista, responde con el texto normal y añade al final una línea oculta así: "ACTION: ADD <item>".
2. Si el usuario te pide SUGERIR un menú, usa las recetas disponibles.
3. Responde siempre en español, de forma concisa y amigable.
4. Si el usuario te pregunta por recetas que TIENE, busca en [Mis Recetas].
    `;

    // 2. Call Ollama
    const response = await axios.post('http://localhost:11434/api/chat', {
        model: 'phi3',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: query }
        ],
        stream: false
    });

    const llmOutput = response.data.message.content;
    
    // 3. Parse Actions
    let finalAnswer = llmOutput;
    let actionTaken = false;

    // Regex for ACTION: ADD <item>
    const actionRegex = /ACTION: ADD (.*)/i;
    const match = llmOutput.match(actionRegex);

    if (match && match[1]) {
        const itemToAdd = match[1].trim();
        // Execute DB Action
        const stmt = db.prepare('INSERT INTO shopping_list (item) VALUES (?)');
        stmt.run(itemToAdd);
        
        // Clean up the output so the user doesn't see the raw action code if possible, 
        // OR leave it if we want to debug. Let's strip it for cleaner UI.
        finalAnswer = finalAnswer.replace(match[0], '').trim();
        actionTaken = true;
    }

    res.json({ answer: finalAnswer, action: actionTaken ? 'item_added' : null });

  } catch (error) {
    console.error('Ollama Error:', error.message);
    // Fallback if Ollama is down
    if (error.code === 'ECONNREFUSED') {
        res.json({ answer: 'No puedo conectar con mi cerebro (Ollama). Asegúrate de tener OLLAMA ejecutándose en tu ordenador.' });
    } else {
        res.json({ answer: 'Tuve un error al procesar tu solicitud. Inténtalo de nuevo.' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
