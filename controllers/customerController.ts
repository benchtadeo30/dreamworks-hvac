import { NextFunction, Request, Response } from "express"
import validator from 'validator'
import { customerDetails } from "../routes/customer";
import { findCustomerByEmail, matchCustomerPassword } from "../Services/CustomerService";

export const customerLogin = async (req: Request<{}, {}, customerDetails>, res: Response, next: NextFunction) => {
    const {
        email,
        password
    } = req.body

    if(!validator.isEmail(email)){
    const err = new Error("Please enter a valid email.")
     err.status = 400
     return next(err)
    }

    try {
        const findEmail = await findCustomerByEmail(email)
        
        if(findEmail.length > 0 && findEmail[0]){
           try {
             const verify_account = await matchCustomerPassword(password, findEmail[0].password)
             if(verify_account){
            return res.status(200).json({msg: 'Login Successfully!'})
             }
             return res.status(400).json({error: 'Password does not match! Please try again.'})
           } catch (error) {
            if(error instanceof Error){
                 const err = new Error(error.message)
     err.status = 400
     return next(err)
            }
           }
        }

    const err = new Error("Email does not exist!")
     err.status = 400
     return next(err)

    } catch (error) {
       if(error instanceof Error){
         const err = new Error(error.message)
     err.status = 400
     return next(err)
       }
    }
}