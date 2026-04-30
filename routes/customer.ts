import express, { NextFunction, Request, Response }  from "express";
import { customerLogin, customerSignOut } from "../controllers/customerController";
import { AppError } from "../utils/AppError";

const customerRouter = express.Router();

export interface customerDetails {
    email: string,
    password: string
}

customerRouter.get('/', (req, res) => {
     console.log("SESSION:", req.session);
    if(req.session.user){
       return res.render('customer-portal')
    }
    return res.redirect("/")
})

customerRouter.get('/login', (req, res) => {
    res.render('login-customer')
})

customerRouter.post('/login', customerLogin)
customerRouter.get('/signout', customerSignOut)

export default customerRouter;