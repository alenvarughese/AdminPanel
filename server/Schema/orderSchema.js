const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shippingAddress: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        country: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true }
    },
    cartItems: [
        {
            id: { type: String, required: true },
            title: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            image01: { type: String }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Preparing', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);
