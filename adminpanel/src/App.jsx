import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Import your components
import AuthPage from './AuthPage';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import CategoryPage from './CategoryPage';
import MenuPage from './MenuPage';
import UserPage from './UserPage';
import OrderPage from './OrderPage';

export default function App() {

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Fixed admin credentials
  const ADMIN_EMAIL = 'admin@restaurant.com';
  const ADMIN_PASSWORD = 'admin123';

  const [error, setError] = useState('');

  const handleLogin = (email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser = { email: ADMIN_EMAIL, role: 'admin' };
      localStorage.setItem('user', JSON.stringify(adminUser));
      setCurrentUser(adminUser);
      setError('');
    } else {
      setError('Invalid email or password.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const AdminLayout = () => {
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar onLogout={handleLogout} />
        <div className="flex-1 ml-64 p-8">
          <Outlet />
        </div>
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !currentUser ? (
              <AuthPage
                onLogin={handleLogin}
                error={error}
              />
            ) : (
              <Navigate to="/admin/dashboard" replace />
            )
          }
        />

        {currentUser ? (
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="category" element={<CategoryPage />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="users" element={<UserPage />} />
            <Route path="orders" element={<OrderPage />} />

            <Route path="settings" element={
              <div className="p-8 text-center text-gray-500 text-xl font-bold">
                Settings Page Coming Soon ⚙️
              </div>
            } />

            <Route index element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
        ) : (
          <Route path="/admin/*" element={<Navigate to="/" replace />} />
        )}

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}