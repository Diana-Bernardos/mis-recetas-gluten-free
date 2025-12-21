import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';

const CreateRecipePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/recipes', formData);
      navigate('/recipes');
    } catch (error) {
      console.error(error);
      alert('Error al guardar la receta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
       <div className="glass p-8 rounded-3xl shadow-xl border border-white/60">
        <h2 className="text-3xl font-bold text-coffee mb-6 text-center font-serif">Nueva Receta</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-coffee font-semibold mb-2">Nombre de la Receta</label>
            <input 
              type="text" 
              name="title" 
              required
              className="w-full px-4 py-3 rounded-xl border border-peach bg-white/50 focus:outline-none focus:ring-2 focus:ring-coffee/20"
              placeholder="Ej: Pan de Maíz sin Gluten"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-coffee font-semibold mb-2">URL de Imagen (Opcional)</label>
            <input 
              type="url" 
              name="image" 
              className="w-full px-4 py-3 rounded-xl border border-peach bg-white/50 focus:outline-none focus:ring-2 focus:ring-coffee/20"
              placeholder="https://..."
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-coffee font-semibold mb-2">Ingredientes</label>
            <textarea 
              name="ingredients" 
              required
              rows="4"
              className="w-full px-4 py-3 rounded-xl border border-peach bg-white/50 focus:outline-none focus:ring-2 focus:ring-coffee/20"
              placeholder="Lista los ingredientes..."
              onChange={handleChange}
            ></textarea>
          </div>

          <div>
            <label className="block text-coffee font-semibold mb-2">Instrucciones</label>
            <textarea 
              name="instructions" 
              required
              rows="6"
              className="w-full px-4 py-3 rounded-xl border border-peach bg-white/50 focus:outline-none focus:ring-2 focus:ring-coffee/20"
              placeholder="¿Cómo se prepara?"
              onChange={handleChange}
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-coffee text-white font-bold py-4 rounded-xl shadow-lg hover:bg-orange-800 transition transform hover:scale-[1.02] flex justify-center items-center gap-2"
          >
            {loading ? 'Guardando...' : <><Save size={20}/> Guardar Receta</>}
          </button>
        </form>
       </div>
    </div>
  );
};

export default CreateRecipePage;
