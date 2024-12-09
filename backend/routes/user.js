const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();

router.get('/search', userController.searchUser);

router.get('/user', userController.getUserInfo);