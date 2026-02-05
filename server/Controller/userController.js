const User = require('../Schema/userSchema');
const bcrypt = require('bcrypt');

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.send({
                success: false,
                message: "User already exists with this email"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: 'customer',
            status: 'inactive'
        });

        await newUser.save();
        res.send({
            success: true,
            message: "User registered successfully",
            data: newUser
        });
    } catch (err) {
        res.send({
            success: false,
            message: "Signup failed",
            data: err.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.send({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.send({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Atomically update status to active on login using the request email
        const result = await User.findOneAndUpdate(
            { email: email },
            { $set: { status: 'active' } },
            { new: true }
        );

        res.send({
            success: true,
            message: "Login successful",
            data: result
        });
    } catch (err) {
        res.send({
            success: false,
            message: "Login failed",
            data: err.message
        });
    }
};

const getUsers = async (req, res) => {
    try {
        // Only show users with role 'customer' as requested
        const users = await User.find({ role: 'customer' });
        res.send({
            success: true,
            message: "Users retrieved successfully",
            data: users
        });
    } catch (err) {
        res.send({
            success: false,
            message: "Failed to retrieve users",
            data: err.message
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.send({
            success: true,
            message: "User deleted successfully"
        });
    } catch (err) {
        res.send({
            success: false,
            message: "Failed to delete user",
            data: err.message
        });
    }
};

const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['active', 'inactive'].includes(status)) {
            return res.send({
                success: false,
                message: "Invalid status value"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        res.send({
            success: true,
            message: "Status updated successfully",
            data: updatedUser
        });
    } catch (err) {
        res.send({
            success: false,
            message: "Failed to update status",
            data: err.message
        });
    }
};

module.exports = { signup, login, getUsers, deleteUser, updateUserStatus };
