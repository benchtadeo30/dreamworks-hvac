import { NextFunction, Request, Response } from "express"
import validator from 'validator';
import { createNewUser } from "../Services/UserService";

interface registrationDetails {
regFirstName: string,
regLastName: string,
regEmail: string,
regPhone: string,
regPassword: string,
regPasswordConfirm: string,
regTermsConditions: boolean,
}

export const registerUser = async (req: Request<{}, {}, registrationDetails>, res: Response, next: NextFunction) => {
    const {
      regFirstName,
      regLastName,
      regEmail,
      regPhone,
      regPassword,
      regPasswordConfirm,
      regTermsConditions
    } = req.body;

    if (
      !regFirstName.trim() &&
      !regLastName.trim() &&
      !regEmail.trim() &&
      !regPhone.trim() &&
      !regPassword.trim() &&
      !regPasswordConfirm.trim()
    ) {
      const err = new Error("All fields are required!")
      err.status = 400
      return next(err)
    }
    
    if (!regFirstName.trim()) {
      const err = new Error("Firstname is required!")
      err.status = 400
      return next(err)
    }
    
    if (!regLastName.trim()) {
      const err = new Error("Lastname is required!")
      err.status = 400
      return next(err)
    }
    if (!regEmail.trim()) {
      const err = new Error("Email is required!")
      err.status = 400
      return next(err)
    }
    if (!regPhone.trim()) {
      const err = new Error("Phone number is required!")
      err.status = 400
      return next(err)
    }
    if (!regPassword.trim()) {
      const err = new Error("Password is required!")
      err.status = 400
      return next(err)
    }
    if (!regPasswordConfirm.trim()) {
      const err = new Error("Password Confirmation is required!")
      err.status = 400
      return next(err)
    }

    if(!regTermsConditions){
      const err = new Error("Please accept terms & conditions.")
      err.status = 400
      return next(err)
    }

    if(!validator.isLength(regFirstName.trim(), 3)){
      const err = new Error("Firstname must be atleast 3 characters")
      err.status = 400
      return next(err)
    }
    if(!validator.isAlpha(regFirstName, 'en-US', {ignore: ' .'})){
        const err = new Error("Firstname must be alphabetical letter only (e.g. Dr. John, Joe)")
      err.status = 400
      return next(err)
    }
    if(!validator.isLength(regLastName.trim(), 3)){
      const err = new Error("Lastname must be atleast 3 characters")
      err.status = 400
      return next(err)
    }
    if(!validator.isAlpha(regLastName, 'en-US', {ignore: ' .'})){
      const err = new Error("Lastname must be alphabetical letter only (e.g. Dr. John, Joe)")
      err.status = 400
      return next(err)
    }

    if(!validator.isEmail(regEmail)){
      const err = new Error("Invalid Email!")
      err.status = 400
      return next(err)
    }

    if(!validator.isMobilePhone(regPhone, "en-PH")){
      const err = new Error("Invalid Phone Number! And spacing are not allowed")
      err.status = 400
      return next(err)
    }

    if(validator.isStrongPassword(regPassword, {minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: true}) < 50){
      const err = new Error("Password must be atleast 8 characters including uppercase, numbers, and symbols")
      err.status = 400
      return next(err)
    }

    if(!validator.equals(regPassword, regPasswordConfirm)){
       const err = new Error("Passwords does not match!")
      err.status = 400
      return next(err) 
    }


   try {
     const newUser = await createNewUser({
        first_name: regFirstName.trim(),
        last_name: regLastName.trim(),
        email: regEmail.trim(),
        password: regPassword.trim(),
        phone: regPhone.trim(),
        role: "customer",
        terms_accepted: regTermsConditions
    })
    return res.status(200).json({msg: 'Registered Successfully!', pwd_score: validator.isStrongPassword(regPassword, {minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: true})})
   } catch (error) {
    if (error instanceof Error) {
        if(error.message.includes('Failed query')){
     const err = new Error("Email is already exists!")
     err.status = 400
     return next(err)
        }
} 
     const err = new Error("Cannot create new account. Please try again.")
     err.status = 400
     return next(err) 
   }
}