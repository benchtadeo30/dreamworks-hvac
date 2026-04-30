import { NextFunction, Request, Response } from "express";
import validator from "validator";
import { customerDetails } from "../routes/customer";
import {
  findCustomerByEmail,
  matchCustomerPassword,
} from "../Services/CustomerService";
import { AppError } from "../utils/AppError";

export const customerLogin = async (
  req: Request<{}, {}, customerDetails>,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  
// try {
//     const response = await fetch('http://localhost:5678/webhook-test/b4ef6722-34f8-48a9-accb-a135a5c0dbf0', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({ email, password })
// });

// const resp = await response.json();
// console.log('scsdc')
// } catch (error) {
//   console.log('cant connect to n8n')
//   return next(new AppError("Can't connect to n8n", 400));
// }

  if (!validator.isEmail(email.trim())) {
    return next(new AppError("Please enter a valid email.", 400));
  }

  try {
    const findEmail = await findCustomerByEmail(email.trim());

    if (!findEmail.length || !findEmail[0]) {
      return next(new AppError("Email does not exist!", 400));
    }

    try {
      const isValid = await matchCustomerPassword(
        password,
        findEmail[0].password
      );

      if (!isValid) {
        return next(
          new AppError("Password does not match! Please try again.", 400)
        );
      }
      req.session.user = {
      sessionID: req.sessionID,
      email,
    }
    console.log(req.session.user)
      return res.status(200).json({ success: "Login Successfully!" });
    } catch (error) {
      if (error instanceof Error) {
        return next(new AppError(error.message, 400));
      }
      return next(new AppError("Something went wrong.", 500));
    }
  } catch (error) {
    if (error instanceof Error) {
      return next(new AppError(error.message, 400));
    }
    return next(new AppError("Something went wrong.", 500));
  }
};


export const customerSignOut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
     req.session.destroy((err) => {
     if (err) {
      return next(new AppError("Failed to logout", 500));
    }

    res.clearCookie("connect.sid");
   return res.redirect('/');
  });
}