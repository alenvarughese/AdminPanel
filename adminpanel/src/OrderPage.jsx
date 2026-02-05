import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/orders');
            if (response.data.success) {
                setOrders(response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            const response = await axios.patch(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus });
            if (response.data.success) {
                setOrders(orders.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Preparing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">Order Management</h2>
                    <span className="bg-white px-4 py-1.5 rounded-full text-sm font-bold text-gray-500 shadow-sm border border-gray-100">
                        {orders.length} Total Orders
                    </span>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {orders.length === 0 ? (
                            <div className="bg-white p-10 rounded-2xl shadow-sm text-center text-gray-400">
                                No orders found.
                            </div>
                        ) : (
                            orders.map((order) => (
                                <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition duration-300">
                                    <div className="p-6">
                                        <div className="flex flex-col lg:flex-row justify-between gap-6">
                                            {/* Order Info */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">ID: {order._id.substring(order._id.length - 8)}</span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                    <span className="text-gray-400 text-sm">{new Date(order.createdAt).toLocaleString()}</span>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div>
                                                        <h4 className="text-sm font-bold text-gray-400 uppercase mb-2">Customer</h4>
                                                        <p className="font-bold text-gray-800">{order.shippingAddress.name}</p>
                                                        <p className="text-sm text-gray-600">{order.shippingAddress.email}</p>
                                                        <p className="text-sm text-gray-600">{order.shippingAddress.phone}</p>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-gray-400 uppercase mb-2">Shipping Address</h4>
                                                        <p className="text-sm text-gray-700">
                                                            {order.shippingAddress.city}, {order.shippingAddress.country} ({order.shippingAddress.postalCode})
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Order Details */}
                                            <div className="flex-1 bg-gray-50 p-4 rounded-xl">
                                                <h4 className="text-sm font-bold text-gray-400 uppercase mb-3">Items</h4>
                                                <div className="space-y-2">
                                                    {order.cartItems.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between items-center text-sm">
                                                            <span className="text-gray-700">
                                                                <span className="font-bold text-orange-600">{item.quantity}x</span> {item.title}
                                                            </span>
                                                            <span className="font-medium text-gray-800">₹{item.price * item.quantity}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
                                                    <span className="font-bold text-gray-800">Total Amount</span>
                                                    <span className="text-xl font-extrabold text-orange-600">₹{order.totalAmount}</span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col gap-2 min-w-[150px]">
                                                <h4 className="text-sm font-bold text-gray-400 uppercase mb-2">Update Status</h4>
                                                <button
                                                    onClick={() => updateStatus(order._id, 'Preparing')}
                                                    disabled={order.status === 'Completed' || order.status === 'Cancelled'}
                                                    className={`px-4 py-2 text-xs font-bold rounded-lg transition ${order.status === 'Completed' || order.status === 'Cancelled'
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                                                            : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'
                                                        }`}
                                                >
                                                    Start Preparing
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(order._id, 'Completed')}
                                                    disabled={order.status === 'Completed' || order.status === 'Cancelled'}
                                                    className={`px-4 py-2 text-xs font-bold rounded-lg transition ${order.status === 'Completed' || order.status === 'Cancelled'
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                                                            : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white'
                                                        }`}
                                                >
                                                    Mark Delivered
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(order._id, 'Cancelled')}
                                                    disabled={order.status === 'Completed' || order.status === 'Cancelled'}
                                                    className={`px-4 py-2 text-xs font-bold rounded-lg transition ${order.status === 'Completed' || order.status === 'Cancelled'
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                                                            : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'
                                                        }`}
                                                >
                                                    Cancel Order
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderPage;
