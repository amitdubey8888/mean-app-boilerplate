const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const authMiddleware = require('../middlewares/auth.middleware');


router.post('/signup', UserController.addUser);
router.post('/login', UserController.login);
router.post('/fetch', authMiddleware, UserController.getUsers);
router.post('/islogin', authMiddleware, UserController.isLogin)
router.post('/change-password', authMiddleware, UserController.changePassword)
router.post('/update', authMiddleware, UserController.updateProfile);
router.post('/forgot', UserController.forgotPassword);
router.get('/reset/:token', UserController.reset);
router.post('/reset/:token', UserController.resetPassword);



router.get('/', function (req, res, next) {
    res.status(200);
    res.json({
        message: 'Cool...'
    });
});

module.exports = router;
