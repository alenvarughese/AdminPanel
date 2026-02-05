import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ onLogout }) {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Category', path: '/admin/category', icon: '📁' },
    { name: 'Menu Management', path: '/admin/menu', icon: '🍔' },
    { name: 'Orders', path: '/admin/orders', icon: '🛍️' },
    { name: 'Users', path: '/admin/users', icon: '👥' },
    { name: 'Settings', path: '/admin/settings', icon: '⚙️' },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col fixed left-0 top-0 h-full shadow-2xl z-20">

      <div className="h-20 flex items-center justify-center border-b border-gray-800">
        <h1 className="text-2xl font-bold tracking-wider text-orange-500">
          FOOD<span className="text-white">ADMIN</span>
        </h1>
      </div>


      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-4 px-6 py-4 transition-all duration-200 ${isActive
                      ? 'bg-orange-600 text-white border-r-4 border-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>


      <div className="p-4 border-t border-gray-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition"
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </div>
  );
}