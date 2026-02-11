import express from "express";
import { getCars, getUserData, loginUser, registerUser } from "../controllers/user.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/data', auth, getUserData)
userRouter.get('/cars', getCars)

export default userRouter;