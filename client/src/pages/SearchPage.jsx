import React, { useState } from 'react';
import axios from 'axios';
import { Search as SearchIcon, CloudDownload } from 'lucide-react';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await axios.get(`/api/search?q=${query}`);
      setResults(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const saveRecipe = async (recipe) => {
     try {
        await axios.post('/api/recipes', {
           title: recipe.title,
           ingredients: recipe.ingredients,
           instructions: recipe.instructions,
           image: recipe.image
        });
        alert('¡Receta guardada en tu colección!');
     } catch (e) {
        alert('Error al guardar');
     }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-coffee mb-4 font-serif">Buscador Universal</h2>
        <p className="text-coffee/70">Busca en tus recetas locales y en la mejor base de datos online.</p>
      </div>

      <form onSubmit={handleSearch} className="mb-12 relative max-w-xl mx-auto">
         <input 
           type="text" 
           value={query}
           onChange={e => setQuery(e.target.value)}
           placeholder="¿Qué te apetece hoy? (ej: Pasta, Gluten Free...)"
           className="w-full pl-6 pr-14 py-4 rounded-full border-2 border-peach bg-white/80 shadow-lg text-lg focus:outline-none focus:border-coffee transition"
         />
         <button type="submit" className="absolute right-2 top-2 p-2 bg-coffee text-white rounded-full hover:bg-orange-700 transition">
           <SearchIcon size={24} />
         </button>
      </form>

      {loading && <div className="text-center text-coffee">Buscando...</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((recipe, idx) => (
          <div key={`${recipe.id}-${idx}`} className="glass rounded-xl overflow-hidden shadow-md flex flex-col border border-white/50">
             <div className="h-48 bg-gray-200 relative">
                <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover"/>
                <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-coffee shadow-sm">
                   {recipe.source === 'local' ? 'Casera' : 'Web'}
                </div>
             </div>
             <div className="p-5 flex-1 flex flex-col">
               <h3 className="text-lg font-bold text-coffee mb-2">{recipe.title}</h3>
               {recipe.source !== 'local' && (
                  <button 
                    onClick={() => saveRecipe(recipe)}
                    className="mt-auto w-full py-2 bg-peach text-coffee font-bold rounded-lg hover:bg-peach-dark hover:text-white transition flex items-center justify-center gap-2"
                  >
                    <CloudDownload size={18}/> Guardar en mi lista
                  </button>
               )}
             </div>
          </div>
        ))}
      </div>

      {!loading && hasSearched && results.length === 0 && (
         <div className="text-center text-coffee/60">No se encontraron recetas. Intenta otra búsqueda.</div>
      )}
    </div>
  );
};

export default SearchPage;
