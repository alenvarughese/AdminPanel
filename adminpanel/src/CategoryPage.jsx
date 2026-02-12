import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryService } from './api/categoryService';

export default function CategoryPage() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [categoryForm, setCategoryForm] = useState({ name: '' });
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');


    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await categoryService.getAllCategories();
            if (response.success) {
                console.log("Fetched categories from client:", response.data);
                setCategories(response.data);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError("Failed to connect to server");
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        console.log("Button clicked! Form submission started.");
        if (!categoryForm.name) {
            console.warn("Aborting: Category name is empty.");
            return;
        }

        console.log("Submitting category name:", categoryForm.name);
        try {
            const response = await categoryService.addCategory({ name: categoryForm.name });
            console.log("Service response in Component:", response);
            if (response.success) {
                // Refresh list
                fetchCategories();
                setCategoryForm({ name: '' });
                setShowAddForm(false);
            } else {
                alert(response.message);
            }
        } catch (err) {
            alert("Error adding category");
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        try {
            const response = await categoryService.deleteCategory(id);
            if (response.success) {
                fetchCategories();
            } else {
                alert(response.message);
            }
        } catch (err) {
            alert("Error deleting category");
        }
    };

    const getInternalIcon = (name) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('burger')) return '🍔';
        if (lowerName.includes('pizza')) return '🍕';
        if (lowerName.includes('pasta') || lowerName.includes('italian')) return '🍝';
        if (lowerName.includes('taco') || lowerName.includes('mexican')) return '🌮';
        if (lowerName.includes('salad') || lowerName.includes('healthy')) return '🥗';
        if (lowerName.includes('sushi') || lowerName.includes('japanese')) return '🍣';
        if (lowerName.includes('cake') || lowerName.includes('sweet') || lowerName.includes('dessert')) return '🍰';
        if (lowerName.includes('drink') || lowerName.includes('beverage') || lowerName.includes('coffee')) return '🥤';
        if (lowerName.includes('ice cream')) return '🍦';
        if (lowerName.includes('donut')) return '🍩';
        return '🍽️';
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">Category management</h2>
                        <p className="text-gray-500 mt-2 text-lg">Organize your food items into meaningful groups.</p>
                    </div>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg hover:shadow-orange-200 hover:scale-[1.02] active:scale-95 flex items-center gap-2 hover:cursor-pointer w-full md:w-auto justify-center"
                    >
                        {showAddForm ? 'Close' : 'Add New Category'}
                        <span className="text-xl">{showAddForm ? '×' : '+'}</span>
                    </button>
                </div>

                <div className="mb-8 max-w-md">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search categories..."
                            className="block w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl leading-5 focus:outline-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all shadow-sm text-gray-700 font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {showAddForm && (
                    <div className="mb-12 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <span className="bg-orange-100 text-orange-600 p-2 rounded-lg text-xl">📁</span>
                            Add Category Details
                        </h3>
                        <form onSubmit={handleAddCategory} className="max-w-xl">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category Name</label>
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            placeholder="e.g. Desserts"
                                            className="flex-1 px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                                            value={categoryForm.name}
                                            onChange={e => setCategoryForm({ name: e.target.value })}
                                        />
                                        <button className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold px-8 rounded-2xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 hover:cursor-pointer whitespace-nowrap">
                                            Save Category
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">An icon will be automatically assigned based on the name.</p>
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                {loading ? (
                    <div className="py-20 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        <p className="mt-4 text-gray-500">Loading categories...</p>
                    </div>
                ) : error ? (
                    <div className="py-20 text-center text-red-500 bg-white rounded-3xl border border-red-100 shadow-sm">
                        <p className="text-xl font-bold">Error</p>
                        <p>{error}</p>
                        <button onClick={fetchCategories} className="mt-4 text-orange-600 font-bold hover:underline">Retry</button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {categories.length === 0 ? (
                            <div className="py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                                <span className="text-6xl mb-4">📂</span>
                                <h4 className="text-xl font-bold text-gray-800 mb-2">No categories yet</h4>
                                <p className="text-gray-400 max-w-xs">Create your first category to start organizing your menu items.</p>
                                <button
                                    onClick={() => setShowAddForm(true)}
                                    className="mt-6 text-orange-600 font-bold hover:underline hover:cursor-pointer"
                                >
                                    Add Category Now +
                                </button>
                            </div>
                        ) : categories.filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
                            <div className="py-20 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                                <span className="text-5xl mb-4">🔍</span>
                                <h4 className="text-xl font-bold text-gray-800 mb-2">No matching categories</h4>
                                <p className="text-gray-400">Try adjusting your search to find what you're looking for.</p>
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="mt-4 text-orange-600 font-bold hover:underline hover:cursor-pointer"
                                >
                                    Clear search
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {categories
                                    .filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map(category => (
                                        <div key={category._id} className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden flex flex-col justify-between">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16 transition-all group-hover:bg-orange-500/10 group-hover:scale-110"></div>

                                            <div className="relative">
                                                <div className="flex justify-between items-start mb-6">
                                                    <span className="text-5xl p-4 bg-orange-50 rounded-2xl inline-block group-hover:scale-110 transition-transform duration-300">
                                                        {getInternalIcon(category.name)}
                                                    </span>
                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleDeleteCategory(category._id)}
                                                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors hover:cursor-pointer"
                                                        >
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                        </button>
                                                    </div>
                                                </div>

                                                <h4 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">{category.name}</h4>
                                                <p className="text-gray-500 line-clamp-2 mb-4 leading-relaxed">Food items belonging to {category.name}.</p>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                                                <span className="text-orange-600 bg-orange-50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                                    {category.itemCount || 0} Items
                                                </span>
                                                <button
                                                    onClick={() => navigate('/admin/menu', { state: { filterCategory: category._id } })}
                                                    className="text-gray-300 text-sm font-semibold group-hover:text-orange-400 transition-colors hover:cursor-pointer"
                                                >
                                                    Manage Items →
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
