import express, { NextFunction, Request, Response }  from "express";
import { customerLogin } from "../controllers/customerController";

const customerRouter = express.Router();

export interface customerDetails {
    email: string,
    password: string
}

customerRouter.get('/', (req, res) => {
    res.render('customer-portal')
})

customerRouter.get('/quote', (req, res) => {
    res.render('customer-portal-quote')
})

customerRouter.get('/login', (req, res) => {
    res.render('login-customer')
})

customerRouter.post('/login', customerLogin)

export default customerRouter;