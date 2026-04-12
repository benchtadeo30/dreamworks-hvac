import express, { NextFunction, Request, Response }  from "express";
import validator from 'validator';
import { registerUser } from "../controllers/userController";

const registrationRouter = express.Router();



registrationRouter.get('/', (req, res) => {
 res.render('register')
})

registrationRouter.post('/create', registerUser)

export default registrationRouter;