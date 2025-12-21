import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Search, Bot, PlusCircle } from 'lucide-react';

// Pages - placeholder for now, will implement next
import HomePage from './pages/HomePage';
import RecipesPage from './pages/RecipesPage';
import CreateRecipePage from './pages/CreateRecipePage';
import SearchPage from './pages/SearchPage';
import ShoppingListPage from './pages/ShoppingListPage';
import AssistantPage from './pages/AssistantPage';
import RecipeDetailsPage from './pages/RecipeDetailsPage';

const NavLink = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link to={to} className={`flex flex-col items-center p-2 rounded-lg transition-colors ${isActive ? 'text-coffee font-bold bg-peach-dark/20' : 'text-coffee/70 hover:text-coffee hover:bg-peach/50'}`}>
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
};

function App() {
  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-[url('/bg-texture.jpg')] bg-cover bg-fixed">
      {/* Overlay to ensure text readability if image is missing */}
      <div className="min-h-screen bg-orange-50/80">
        
        {/* Top Navigation (Desktop) / Header */}
        <header className="bg-peach/90 backdrop-blur-md shadow-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
               <div className="w-10 h-10 bg-coffee text-white rounded-full flex items-center justify-center font-serif text-xl border-2 border-white shadow">MR</div>
               <h1 className="text-xl md:text-2xl font-bold text-coffee drop-shadow-sm hidden md:block">Mis Recetas Sin Gluten</h1>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-6">
              <Link to="/" className="text-coffee font-medium hover:text-orange-700 transition">Inicio</Link>
              <Link to="/recipes" className="text-coffee font-medium hover:text-orange-700 transition">Recetas</Link>
              <Link to="/create" className="text-coffee font-medium hover:text-orange-700 transition">Crear</Link>
              <Link to="/shopping-list" className="text-coffee font-medium hover:text-orange-700 transition">Lista Compra</Link>
              <Link to="/search" className="text-coffee font-medium hover:text-orange-700 transition">Buscar</Link>
              <Link to="/assistant" className="text-coffee font-medium hover:text-orange-700 transition">Asistente</Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/recipes/:id" element={<RecipeDetailsPage />} />
            <Route path="/create" element={<CreateRecipePage />} />
            <Route path="/shopping-list" element={<ShoppingListPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/assistant" element={<AssistantPage />} />
          </Routes>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-peach/95 backdrop-blur-lg border-t border-coffee/20 flex justify-around p-2 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <NavLink to="/" icon={<Home size={24} />} label="Inicio" />
          <NavLink to="/recipes" icon={<BookOpen size={24} />} label="Recetas" />
          <NavLink to="/create" icon={<PlusCircle size={24} />} label="Crear" />
          <NavLink to="/search" icon={<Search size={24} />} label="Buscar" />
          <NavLink to="/assistant" icon={<Bot size={24} />} label="Asis." />
        </nav>

        <footer className="text-center py-8 text-coffee/60 text-sm">
          <p>© 2025 Mis Recetas Sin Gluten - By Diana</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
