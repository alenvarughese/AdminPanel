import React, { useState, useEffect } from 'react';
import { userAPI } from './api/userService';

export default function UserPage() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userAPI.getAllUsers();
      if (response.success) {
        setUsers(response.data);
      } else {
        setError(response.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Unable to connect to the server. Please make sure the backend is running.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      try {
        const response = await userAPI.deleteUser(id);
        if (response.success) {
          // Refresh list
          fetchUsers();
        } else {
          alert(response.message || "Failed to delete user");
        }
      } catch (err) {
        console.error("Delete error:", err);
        alert("Error connecting to server");
      }
    }
  };


  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">User Management</h2>
          <span className="bg-white px-4 py-1.5 rounded-full text-sm font-bold text-gray-500 shadow-sm border border-gray-100">
            {users.length} Users
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-gray-500">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <p className="mt-4">Loading users...</p>
            </div>
          ) : error ? (
            <div className="p-10 text-center">
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
                <p className="font-bold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
              <button
                onClick={fetchUsers}
                className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                Retry
              </button>
            </div>
          ) : users.length === 0 ? (
            <div className="p-10 text-center text-gray-400 bg-gray-50">
              No users found in the database.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-orange-50 text-orange-800 text-sm uppercase tracking-wider">
                    <th className="p-5 font-bold">User Name</th>
                    <th className="p-5 font-bold">Email</th>
                    <th className="p-5 font-bold">Role</th>
                    <th className="p-5 font-bold">Join Date</th>
                    <th className="p-5 font-bold">Status</th>
                    <th className="p-5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition duration-200">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            {user.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-gray-800">{user.name}</span>
                        </div>
                      </td>
                      <td className="p-5 text-gray-600">{user.email}</td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
                          : 'bg-blue-100 text-blue-700 border border-blue-200'
                          }`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="p-5 text-gray-500 text-sm font-mono">
                        {new Date(user.joinDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="p-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold transition shadow-sm ${user.status === 'active'
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : 'bg-gray-100 text-gray-500 border border-gray-200'
                            }`}
                        >
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
                          title="Delete User"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}