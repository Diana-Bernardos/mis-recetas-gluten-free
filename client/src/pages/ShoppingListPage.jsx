import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, CheckSquare, Square } from 'lucide-react';

const ShoppingListPage = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get('/api/shopping-list');
      setItems(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    try {
      const res = await axios.post('/api/shopping-list', { item: newItem });
      setItems([res.data, ...items]);
      setNewItem('');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`/api/shopping-list/${id}`);
      setItems(items.filter(i => i.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const toggleCheck = async (item) => {
    try {
      await axios.put(`/api/shopping-list/${item.id}/check`, { checked: !item.checked });
      setItems(items.map(i => i.id === item.id ? { ...i, checked: !i.checked ? 1 : 0 } : i));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass p-8 rounded-3xl shadow-xl border border-white/60">
        <h2 className="text-3xl font-bold text-coffee mb-6 text-center font-serif">Lista de la Compra</h2>

        {/* Add Item Form */}
        <form onSubmit={addItem} className="flex gap-2 mb-8">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Añadir ingrediente..."
            className="flex-1 px-4 py-3 rounded-xl border border-peach bg-white/50 focus:outline-none focus:ring-2 focus:ring-coffee/20"
          />
          <button 
            type="submit"
            className="bg-coffee text-white p-3 rounded-xl hover:bg-orange-800 transition shadow-lg"
          >
            <Plus size={24} />
          </button>
        </form>

        {/* List */}
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl transition ${item.checked ? 'bg-peach/30 opacity-60' : 'bg-white/60 shadow-sm'}`}>
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => toggleCheck(item)}>
                {item.checked ? <CheckSquare className="text-coffee" /> : <Square className="text-coffee/50" />}
                <span className={`text-lg text-coffee font-medium ${item.checked ? 'line-through' : ''}`}>{item.item}</span>
              </div>
              <button onClick={() => deleteItem(item.id)} className="text-coffee/40 hover:text-red-500 transition">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          
          {items.length === 0 && (
            <p className="text-center text-coffee/50 py-4 italic">Tu lista está vacía</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingListPage;
