const express = require('express');
const router = express.Router();
const { addCategory, getCategories, deleteCategory } = require('../Controller/categoryController');

router.post('/api/categories', addCategory);
router.get('/api/categories', getCategories);
router.delete('/api/categories/:id', deleteCategory);

module.exports = router;
