import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Clock, Users } from 'lucide-react';

const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await axios.get('/api/recipes');
      setRecipes(res.data);
    } catch (error) {
      console.error("Error loading recipes", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-coffee">Cargando recetas...</div>;

  return (
    <div>
      <h2 className="text-4xl font-bold text-coffee mb-8 font-serif">Mis Recetas</h2>
      
      {recipes.length === 0 ? (
        <div className="text-center py-20 bg-white/50 rounded-2xl border border-dashed border-coffee/30">
          <p className="text-xl text-coffee/60">No hay recetas guardadas aún.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map(recipe => (
             <Link to={`/recipes/${recipe.id}`} key={recipe.id} className="glass rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 flex flex-col h-full border border-white/50 group block">
                <div className="h-48 bg-gray-200 overflow-hidden relative">
                   <img 
                     src={recipe.image} 
                     alt={recipe.title} 
                     className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                     onError={(e) => {e.target.src = 'https://placehold.co/600x400/f2d1c6/52362c?text=Receta'}}
                   />
                   <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-coffee shadow-sm">
                      {recipe.source === 'local' ? 'Casera' : 'Web'}
                   </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-coffee mb-2 leading-tight group-hover:text-orange-800 transition">{recipe.title}</h3>
                  <div className="text-sm text-coffee/70 mb-4 line-clamp-3 bg-orange-50/50 p-2 rounded">
                    {recipe.ingredients}
                  </div>
                  <div className="mt-auto pt-4 border-t border-coffee/10 flex justify-between text-sm text-coffee/60">
                    <span className="flex items-center gap-1"><Clock size={16}/> 45 min</span>
                    <span className="flex items-center gap-1"><Users size={16}/> 4 pers</span>
                  </div>
                </div>
             </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipesPage;
