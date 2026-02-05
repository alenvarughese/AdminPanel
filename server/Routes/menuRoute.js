const express = require('express');
const router = express.Router();
const { addMenuItem, getMenuItems, deleteMenuItem, updateMenuItem } = require('../Controller/menuController');

router.post('/add-menu', addMenuItem);
router.get('/get-menu', getMenuItems);
router.delete('/delete-menu/:id', deleteMenuItem);
router.put('/update-menu/:id', updateMenuItem);

module.exports = router;
