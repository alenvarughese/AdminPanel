const express = require('express');
const router = express.Router();
const { signup, login, getUsers, deleteUser, updateUserStatus } = require('../Controller/userController');

router.post('/api/signup', signup);
router.post('/api/login', login);
router.get('/api/users', getUsers);
router.delete('/api/users/:id', deleteUser);
router.patch('/api/users/:id/status', updateUserStatus);

module.exports = router;
