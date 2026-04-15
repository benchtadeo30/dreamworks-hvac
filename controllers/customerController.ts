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

  if (!validator.isEmail(email)) {
    return next(new AppError("Please enter a valid email.", 400));
  }

  try {
    const findEmail = await findCustomerByEmail(email);

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

      return res.status(200).json({ msg: "Login Successfully!" });
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
