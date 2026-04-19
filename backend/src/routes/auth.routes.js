const express = require('express');
const authRouter = express.Router();
const { registerUserController } = require('../controllers/auth.controller');
const { loginUserController } = require('../controllers/auth.controller');
const { logoutUserController } = require('../controllers/auth.controller');
const { getMeController } = require('../controllers/auth.controller');
const authUser = require('../middlewares/auth.middleware');
/**
 * 
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post('/register', registerUserController);
/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
authRouter.post('/login', loginUserController);


/**
 * @route GET /api/auth/logout
 * @desc Logout a user
 * @access Public
 */
authRouter.get('/logout', logoutUserController);




/**
 * @route GET/api/auth/get-me
 * @desc Get the logged in user's details
 * @access Private
 */
authRouter.get('/get-me', authUser, getMeController);
module.exports = authRouter;