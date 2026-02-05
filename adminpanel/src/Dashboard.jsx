import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { fetchDashboardStats } from './api/dashboardService';

export default function Dashboard() {
  const [data, setData] = useState({
    stats: [],
    revenueData: [],
    categoryData: [],
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const response = await fetchDashboardStats();
        if (response.success) {
          setData(response.data);
        } else {
          setError(response.message || 'Failed to fetch data');
        }
      } catch (err) {
        setError('Connection to server failed');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 min-h-screen">
        <p className="text-xl font-bold">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const { stats, revenueData, categoryData, recentOrders } = data;

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h2>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-gray-500 font-medium text-sm">{stat.title}</h3>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.color}`}>{stat.change}</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Revenue Trends</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#ea580c' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ea580c"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>


        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Popular Categories</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  stroke="#9ca3af"
                  interval={0}
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  cursor={{ fill: '#fff7ed' }}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend layout="horizontal" verticalAlign="top" align="right" wrapperStyle={{ top: -10 }} />
                <Bar dataKey="sales" name="Sales Count" fill="#f97316" radius={[4, 4, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>


      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Recent Orders</h3>
          <button className="text-orange-600 font-semibold hover:text-orange-700 text-sm hover:cursor-pointer">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Items</th>
                <th className="p-4 font-semibold">Total</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-mono text-sm text-gray-500">{order.id}</td>
                  <td className="p-4 font-medium text-gray-800">{order.customer}</td>
                  <td className="p-4 text-gray-600 text-sm">{order.items}</td>
                  <td className="p-4 font-bold text-gray-800">{order.total}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}