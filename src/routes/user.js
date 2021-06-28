const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/UserController')

router.get('/register',userController.index)
router.post('/register',userController.save)
//login
router.get('/login',userController.renderLogin)
router.post('/login',userController.handdleLogin)

module.exports = router;