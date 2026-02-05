import React, { useState } from 'react';

export default function FoodAppAdmin({ user, onLogout }) {
  
  const [foodItems, setFoodItems] = useState([
    {
      id: 1,
      name: 'Classic Burger',
      category: 'Fast Food',
      price: '12.99',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 2,
      name: 'Margherita Pizza',
      category: 'Italian',
      price: '15.50',
      image: '  https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=500&q=60'
    }
  ]);

  const [foodForm, setFoodForm] = useState({
    name: '',
    category: '',
    price: '',
    image: ''
  });

  const handleFoodChange = (e) => {
    setFoodForm({ ...foodForm, [e.target.name]: e.target.value });
  };

  const handleAddFood = (e) => {
    e.preventDefault();
    if (!foodForm.name || !foodForm.price) return;

    const newFood = {
      id: Date.now(),
      ...foodForm,
      image: foodForm.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=60'
    };

    setFoodItems([...foodItems, newFood]);
    setFoodForm({ name: '', category: '', price: '', image: '' });
  };

  const handleDeleteFood = (id) => {
    setFoodItems(foodItems.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-orange-50 font-sans">
      <nav className="bg-orange-600 text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold">🍔 FoodAdmin</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm opacity-90 hidden sm:block">Logged in as: {user?.email}</span>
          <button 
            onClick={onLogout}
            className="bg-white text-orange-600 px-4 py-2 rounded-lg font-bold hover:bg-orange-100 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-xl sticky top-24">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Add New Item</h2>
            <form onSubmit={handleAddFood} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Food Name</label>
                <input
                  type="text"
                  name="name"
                  value={foodForm.name}
                  onChange={handleFoodChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="e.g. Spicy Tacos"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Category</label>
                  <select
                    name="category"
                    value={foodForm.category}
                    onChange={handleFoodChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                  >
                    <option value="">Select...</option>
                    <option value="Fast Food">Fast Food</option>
                    <option value="Italian">Italian</option>
                    <option value="Mexican">Mexican</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Drinks">Drinks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={foodForm.price}
                    onChange={handleFoodChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={foodForm.image}
                  onChange={handleFoodChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="https://example.com/food.jpg"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 hover:cursor-pointer transition shadow-md"
              >
                + Add to Menu
              </button>
            </form>
          </div>
        </div>

        
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Current Menu</h2>
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
              {foodItems.length} Items
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {foodItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:cursor-pointer transition duration-300 border border-gray-100 flex flex-col">
                <div className="h-48 overflow-hidden relative group">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-bold text-gray-800 shadow">
                    ${item.price}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-orange-500 uppercase tracking-wide mb-1">{item.category}</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                  </div>
                  <button 
                    onClick={() => handleDeleteFood(item.id)}
                    className="mt-4 w-full py-2 border-2 border-red-100 text-red-500 rounded-lg hover:cursor-pointer hover:bg-red-50 hover:border-red-200 transition text-sm font-semibold"
                  >
                    Remove Item
                  </button>
                </div>
              </div>
            ))}
            
            {foodItems.length === 0 && (
              <div className="col-span-full text-center py-10 text-gray-400 italic">
                No food items yet. Add some from the left panel!
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}