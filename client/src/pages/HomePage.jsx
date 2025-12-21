import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, UtensilsCrossed, ChefHat, Salad } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="space-y-12 animate-fade-in">
      
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20 relative overflow-hidden rounded-3xl glass shadow-xl border border-white/50">
        <div className="relative z-10 px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-coffee mb-6 drop-shadow-sm font-serif">
            Mis Recetas <br/> <span className="text-orange-600">Sin Gluten</span>
          </h1>
          <p className="text-lg text-coffee/80 max-w-2xl mx-auto mb-8 font-medium">
            Bienvenid@ a tu espacio personal de cocina saludable. 
            Crea, guarda y descubre deliciosas recetas libres de gluten.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/recipes" className="bg-coffee text-white px-8 py-3 rounded-full font-bold hover:bg-orange-800 transition shadow-lg flex items-center gap-2 transform hover:scale-105 duration-200">
              Ver Recetas <ArrowRight size={20} />
            </Link>
            <Link to="/create" className="bg-peach-dark text-white px-8 py-3 rounded-full font-bold hover:bg-orange-700 transition shadow-lg transform hover:scale-105 duration-200">
              Crear Nueva
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/create" className="glass p-8 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 group border border-white/60">
          <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-peach transition-colors">
            <ChefHat size={32} className="text-coffee" />
          </div>
          <h3 className="text-xl font-bold text-coffee mb-2">Crear Recetas</h3>
          <p className="text-coffee/70">Guarda tus propias creaciones culinarias en tu recetario digital.</p>
        </Link>

        <Link to="/search" className="glass p-8 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 group border border-white/60">
          <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-peach transition-colors">
            <Salad size={32} className="text-coffee" />
          </div>
          <h3 className="text-xl font-bold text-coffee mb-2">Descubrir</h3>
          <p className="text-coffee/70">Encuentra nuevas ideas buscando ingredientes o platos en la web.</p>
        </Link>
        
        <Link to="/shopping-list" className="glass p-8 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 group border border-white/60">
          <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-peach transition-colors">
            <UtensilsCrossed size={32} className="text-coffee" />
          </div>
          <h3 className="text-xl font-bold text-coffee mb-2">Lista Compra</h3>
          <p className="text-coffee/70">Gestiona tus ingredientes pendientes de comprar.</p>
        </Link>

        <Link to="/recipes" className="glass p-8 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 group border border-white/60">
           <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-peach transition-colors">
            <UtensilsCrossed size={32} className="text-coffee" />
          </div>
          <h3 className="text-xl font-bold text-coffee mb-2">Cocinar</h3>
          <p className="text-coffee/70">Consulta tus recetas guardadas con instrucciones paso a paso.</p>
        </Link>
      </section>

      {/* Placeholder for Featured Images (Legacy images) */}
      <section className="glass p-8 rounded-2xl shadow-lg border border-white/60">
        <h2 className="text-3xl font-bold text-coffee mb-6 text-center font-serif">✨ Destacados</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[1, 2, 3, 4].map((i) => (
             <div key={i} className="aspect-square bg-peach/30 rounded-xl flex items-center justify-center border border-white overflow-hidden">
                <span className="text-coffee/40">Foto {i}</span>
             </div>
           ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
