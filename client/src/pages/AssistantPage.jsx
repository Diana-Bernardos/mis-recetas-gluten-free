import React, { useState } from 'react';
import axios from 'axios';
import { Bot, MessageSquare, Send } from 'lucide-react';

const AssistantPage = () => {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState([
    { type: 'bot', text: '¡Hola! Soy tu asistente de cocina. Puedo ayudarte a añadir cosas a la lista o sugerirte qué comer hoy. ¡Prueba a escribir "Sugiereme un menú"!' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = query;
    setHistory(prev => [...prev, { type: 'user', text: userMsg }]);
    setQuery('');
    setLoading(true);

    try {
      // Simulate small delay for realism
      const res = await axios.post('/api/assistant', { query: userMsg });
      setHistory(prev => [...prev, { type: 'bot', text: res.data.answer }]);
    } catch (error) {
      setHistory(prev => [...prev, { type: 'bot', text: 'Lo siento, he tenido un problema parea pensar. Inténtalo de nuevo.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 h-[calc(100vh-140px)] flex flex-col">
      <div className="text-center mb-6">
        <div className="bg-white/40 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-4 shadow-inner">
           <Bot size={48} className="text-coffee/80" />
        </div>
        <h2 className="text-3xl font-bold text-coffee font-serif">Asistente Virtual</h2>
      </div>
      
      {/* Chat Area */}
      <div className="glass flex-1 p-4 rounded-2xl border border-white/50 overflow-y-auto mb-4 flex flex-col gap-4">
         {history.map((msg, idx) => (
           <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-2xl max-w-[80%] shadow-sm ${msg.type === 'user' ? 'bg-coffee text-white rounded-tr-none' : 'bg-white text-coffee rounded-tl-none'}`}>
                 {msg.text}
              </div>
           </div>
         ))}
         {loading && (
             <div className="flex justify-start">
               <div className="bg-white text-coffee p-3 rounded-2xl rounded-tl-none shadow-sm animate-pulse">
                  Pensando...
               </div>
             </div>
         )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="relative">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Escribe un mensaje... (ej: Añade pan a la lista)" 
          className="w-full pl-6 pr-14 py-4 rounded-full border-2 border-peach bg-white/80 shadow-lg text-lg focus:outline-none focus:border-coffee transition" 
          disabled={loading}
        />
        <button 
          type="submit" 
          disabled={loading}
          className="absolute right-2 top-2 p-2 bg-coffee text-white rounded-full hover:bg-orange-700 transition disabled:opacity-50"
        >
          <Send size={24}/>
        </button>
      </form>
    </div>
  );
};

export default AssistantPage;
