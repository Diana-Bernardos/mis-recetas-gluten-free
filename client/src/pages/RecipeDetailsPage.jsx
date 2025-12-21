import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock, Users, ArrowLeft, Heart, ChefHat } from 'lucide-react';

const RecipeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if it's a local recipe or external (this page handles local for now, 
  // but could be expanded. For MealDB we might need a different approach or just save it first)
  // For simplicity, we assume this ID exists in our local DB or we try to fetch it.
  
  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const res = await axios.get(`/api/recipes/${id}`);
      setRecipe(res.data);
    } catch (error) {
       console.error("Error fetching recipe details", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-coffee">Cargando...</div>;
  if (!recipe) return <div className="text-center py-20 text-coffee">Receta no encontrada. <button onClick={() => navigate(-1)} className="underline">Volver</button></div>;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-coffee/60 hover:text-coffee transition font-medium"
      >
        <ArrowLeft size={20} className="mr-2"/> Volver
      </button>

      <div className="glass rounded-3xl overflow-hidden shadow-2xl border border-white/60">
        
        {/* Header Image */}
        <div className="h-80 md:h-96 relative bg-gray-200">
           <img 
             src={recipe.image} 
             alt={recipe.title} 
             className="w-full h-full object-cover"
             onError={(e) => {e.target.src = 'https://placehold.co/600x400/f2d1c6/52362c?text=Receta'}}
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-8 text-white w-full">
                 <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4 drop-shadow-md">{recipe.title}</h1>
                 <div className="flex gap-6 text-sm md:text-base font-medium">
                    <span className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full"><Clock size={18}/> 45 min</span>
                    <span className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full"><Users size={18}/> 4 personas</span>
                    <span className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full"><ChefHat size={18}/> {recipe.source === 'local' ? 'Casera' : 'Web'}</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid md:grid-cols-[1fr_2fr] gap-8 p-8 md:p-12">
           
           {/* Sidebar: Ingredients */}
           <div className="bg-orange-50/50 p-6 rounded-2xl h-fit border border-peach/30">
              <h3 className="text-xl font-bold text-coffee mb-6 font-serif border-b border-coffee/10 pb-2">Ingredientes</h3>
              <ul className="space-y-3">
                 {recipe.ingredients.split('\n').map((ing, i) => (
                    <li key={i} className="flex items-start text-coffee/80 leading-relaxed text-sm">
                       <span className="mr-2 text-peach-dark">•</span> {ing}
                    </li>
                 ))}
              </ul>
              
              <button 
                className="w-full mt-8 py-3 bg-peach text-coffee font-bold rounded-xl hover:bg-peach-dark hover:text-white transition flex items-center justify-center gap-2 shadow-sm"
                onClick={() => alert('¡Pronto podrás añadir esto a la lista de compra!')}
              >
                 <Heart size={18}/> Guardar Favorito
              </button>
           </div>

           {/* Main: Instructions */}
           <div>
              <h3 className="text-2xl font-bold text-coffee mb-6 font-serif border-b border-coffee/10 pb-2">Elaboración</h3>
              <div className="space-y-6 text-coffee/80 leading-relaxed text-lg whitespace-pre-line">
                 {recipe.instructions}
              </div>
           </div>

        </div>

      </div>
    </div>
  );
};

export default RecipeDetailsPage;
