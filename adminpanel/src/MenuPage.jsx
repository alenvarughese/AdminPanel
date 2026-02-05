import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getMenuItems, addMenuItem, deleteMenuItem, updateMenuItem } from './api/menuService';
import { categoryService } from './api/categoryService';

export default function MenuPage() {
  const location = useLocation();
  const [foodItems, setFoodItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(null);

  const [foodForm, setFoodForm] = useState({ name: '', description: '', category: '', price: '', image: null, imagePreview: '' });
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

  useEffect(() => {
    fetchMenuData();
    fetchCategories();

    if (location.state && location.state.filterCategory) {
      setActiveFilter(location.state.filterCategory);
      setFoodForm(prev => ({ ...prev, category: location.state.filterCategory }));
    } else {
      setActiveFilter(null);
    }
  }, [location.state]);

  const fetchMenuData = async () => {
    setLoading(true);
    const response = await getMenuItems();
    if (response.success) {
      setFoodItems(response.data);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const response = await categoryService.getAllCategories();
    if (response.success) {
      setCategories(response.data);
    }
  };


  useEffect(() => {
    return () => {
      if (foodForm.imagePreview) URL.revokeObjectURL(foodForm.imagePreview);
    };
  }, [foodForm.imagePreview]);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFoodForm({ ...foodForm, image: file, imagePreview: previewUrl });
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleEditClick = (item) => {
    setFoodForm({
      name: item.name,
      description: item.description || '',
      category: item.category?._id || '',
      price: item.price,
      image: null,
      imagePreview: item.image
    });
    setEditItemId(item._id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleAddMenuClick = () => {
    resetForm();
    setIsEditing(false);
    setEditItemId(null);
    setShowForm(true);
  };

  const resetForm = () => {
    setFoodForm({
      name: '',
      description: '',
      category: activeFilter || '',
      price: '',
      image: null,
      imagePreview: ''
    });
  };

  const handleSubmitFood = async (e) => {
    e.preventDefault();
    if (!foodForm.name || !foodForm.price || !foodForm.category) {
      alert("Please fill in all required fields (Name, Price, Category)");
      return;
    }

    let imageBase64 = foodForm.imagePreview || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
    if (foodForm.image) {
      try {
        imageBase64 = await convertToBase64(foodForm.image);
      } catch (err) {
        console.error("Error converting image:", err);
      }
    }

    const formData = {
      name: foodForm.name,
      description: foodForm.description,
      category: foodForm.category,
      price: foodForm.price,
      image: imageBase64
    };

    const response = isEditing
      ? await updateMenuItem(editItemId, formData)
      : await addMenuItem(formData);

    if (response.success) {
      fetchMenuData();
      resetForm();
      setShowForm(false);
      setIsEditing(false);
      setEditItemId(null);
    } else {
      console.error(`${isEditing ? 'Update' : 'Add'} menu item failed:`, response);
      alert(`Failed to ${isEditing ? 'update' : 'add'} item: ` + response.message + (response.data ? ` (${response.data})` : ""));
    }
  };

  const handleDeleteFood = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const response = await deleteMenuItem(id);
      if (response.success) {
        fetchMenuData();
      } else {
        alert("Failed to delete item: " + response.message);
      }
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">Menu Management</h2>
          {!showForm && (
            <button
              onClick={handleAddMenuClick}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg border-orange-700 active:translate-y-1 transition-all flex items-center gap-2 hover:cursor-pointer"
            >
              <span className="text-xl">+</span> Add Menu
            </button>
          )}
        </div>

        <div className="w-full">
          {showForm ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative">
                <button
                  onClick={() => setShowForm(false)}
                  className="absolute top-6 left-6 text-gray-400 hover:text-orange-600 transition-colors flex items-center gap-2 text-sm font-bold hover:cursor-pointer"
                >
                  ← Back to Menu
                </button>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 mt-6 flex items-center gap-2">
                  <span className="bg-orange-100 text-orange-600 p-2 rounded-lg text-xl">{isEditing ? '✏️' : '📝'}</span>
                  {isEditing ? 'Edit Menu Item' : 'Add New Item'}
                </h3>

                <form onSubmit={handleSubmitFood} className="space-y-5">


                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Food Image</label>
                    <div className="relative group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="imageUpload"
                      />
                      <label
                        htmlFor="imageUpload"
                        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 relative overflow-hidden ${foodForm.imagePreview
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-300 hover:border-orange-400 hover:bg-gray-50'
                          }`}
                      >
                        {foodForm.imagePreview ? (
                          <>
                            <img
                              src={foodForm.imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />

                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-white font-bold text-sm">Change Image</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center text-gray-400">
                            <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            <span className="text-sm font-medium">Click to upload image</span>
                            <span className="text-xs mt-1 text-gray-400">PNG, JPG up to 5MB</span>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>


                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Item Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Truffle Burger"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition"
                      value={foodForm.name}
                      onChange={e => setFoodForm({ ...foodForm, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                    <textarea
                      placeholder="What makes this dish special?"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition h-24 resize-none"
                      value={foodForm.description}
                      onChange={e => setFoodForm({ ...foodForm, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                      <select
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition appearance-none"
                        value={foodForm.category}
                        onChange={e => setFoodForm({ ...foodForm, category: e.target.value })}
                      >
                        <option value="">Select...</option>
                        {categories.map(cat => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹)</label>
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition"
                        value={foodForm.price}
                        onChange={e => setFoodForm({ ...foodForm, price: e.target.value })}
                      />
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-95 transition duration-300 flex items-center justify-center gap-2 hover:cursor-pointer">
                    <span>{isEditing ? '✓' : '+'}</span> {isEditing ? 'Update Menu Item' : 'Add to Menu'}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="xl:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-bold text-gray-700">
                    {activeFilter
                      ? `Items in ${categories.find(c => c._id === activeFilter)?.name || 'Category'}`
                      : 'Current Menu Items'}
                  </h3>
                  {activeFilter && (
                    <button
                      onClick={() => setActiveFilter(null)}
                      className="text-sm bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-bold hover:bg-orange-200 transition hover:cursor-pointer"
                    >
                      Clear Filter ×
                    </button>
                  )}
                </div>
                <span className="bg-white px-4 py-1.5 rounded-full text-sm font-bold text-gray-500 shadow-sm border border-gray-100">
                  {(activeFilter ? foodItems.filter(i => i.category?._id === activeFilter) : foodItems).length} Items
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <div className="col-span-full flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                  </div>
                ) : (activeFilter ? foodItems.filter(i => i.category?._id === activeFilter) : foodItems).map(item => (
                  <div key={item._id} className="group bg-white rounded-2xl p-3 shadow-sm hover:shadow-xl hover:cursor-pointer transition-all duration-300 border border-gray-100 flex flex-col">

                    <div className="relative h-48 w-full overflow-hidden rounded-xl bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm">
                        <span className="text-gray-900 font-extrabold text-sm">₹{item.price}</span>
                      </div>

                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
                          {item.category?.name || 'Uncategorized'}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-orange-600 transition-colors">{item.name}</h4>
                        <p className="text-gray-400 text-sm line-clamp-2">{item.description || `Freshly prepared ${item.category?.name || 'dish'} made with premium ingredients.`}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="py-2.5 rounded-lg hover:cursor-pointer border border-orange-100 text-orange-500 font-semibold text-sm hover:bg-orange-50 hover:border-orange-200 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteFood(item._id)}
                          className="py-2.5 rounded-lg hover:cursor-pointer border border-red-100 text-red-500 font-semibold text-sm hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {foodItems.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center py-16 text-center text-gray-400 bg-white rounded-2xl border-2 border-dashed border-gray-100">
                    <span className="text-4xl mb-2">🍽️</span>
                    <p className="font-medium">The menu is empty.</p>
                    <p className="text-sm">Start by adding some delicious items!</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}