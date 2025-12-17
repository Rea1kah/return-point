const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { isLogin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', itemController.getItems);
router.get('/:id', itemController.getItemById);

router.post('/', isLogin, 
    upload.fields([
        { name: 'photo', maxCount: 1 }, 
        { name: 'location_photo', maxCount: 1 }
    ]), 
    itemController.createItem
);

router.put('/:id', isLogin, 
    upload.fields([
        { name: 'photo', maxCount: 1 }, 
        { name: 'location_photo', maxCount: 1 }
    ]), 
    itemController.updateItem
);

router.put('/:id/status', isLogin, itemController.updateItem);

router.delete('/:id', isLogin, itemController.deleteItem);

module.exports = router;