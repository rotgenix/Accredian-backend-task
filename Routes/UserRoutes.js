import express from 'express'
import { loginCheck, userLoginController, userLogoutController, userRegisterController } from '../Controllers/UserControllers/UserControllers.js';

export const userRoutes = express.Router();

userRoutes.get('/checklogin', loginCheck);
userRoutes.post('/register', userRegisterController);
userRoutes.post('/login', userLoginController);
userRoutes.get('/logout', userLogoutController);