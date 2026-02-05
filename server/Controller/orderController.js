const Order = require('../Schema/orderSchema');

const createOrder = async (req, res) => {
    try {
        const { userId, shippingAddress, cartItems, totalAmount } = req.body;

        const newOrder = new Order({
            user: userId,
            shippingAddress,
            cartItems,
            totalAmount,
            status: 'Pending'
        });

        await newOrder.save();

        res.send({
            success: true,
            message: "Order placed successfully",
            data: newOrder
        });
    } catch (err) {
        res.send({
            success: false,
            message: "Failed to place order",
            data: err.message
        });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email');
        res.send({
            success: true,
            message: "Orders retrieved successfully",
            data: orders
        });
    } catch (err) {
        res.send({
            success: false,
            message: "Failed to retrieve orders",
            data: err.message
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['Pending', 'Preparing', 'Completed', 'Cancelled'].includes(status)) {
            return res.send({
                success: false,
                message: "Invalid status value"
            });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        res.send({
            success: true,
            message: "Order status updated successfully",
            data: updatedOrder
        });
    } catch (err) {
        res.send({
            success: false,
            message: "Failed to update order status",
            data: err.message
        });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
        res.send({
            success: true,
            message: "User orders retrieved successfully",
            data: orders
        });
    } catch (err) {
        res.send({
            success: false,
            message: "Failed to retrieve user orders",
            data: err.message
        });
    }
};

module.exports = { createOrder, getAllOrders, updateOrderStatus, getUserOrders };
