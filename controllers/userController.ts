import { NextFunction, Request, Response } from "express";
import validator from "validator";
import { createNewUser } from "../Services/UserService";
import { AppError } from "../utils/AppError";

interface registrationDetails {
  regFirstName: string;
  regLastName: string;
  regEmail: string;
  regPhone: string;
  regPassword: string;
  regPasswordConfirm: string;
  regTermsConditions: boolean;
}

export const registerUser = async (
  req: Request<{}, {}, registrationDetails>,
  res: Response,
  next: NextFunction
) => {
  const {
    regFirstName,
    regLastName,
    regEmail,
    regPhone,
    regPassword,
    regPasswordConfirm,
    regTermsConditions,
  } = req.body;

  if (
    !regFirstName.trim() &&
    !regLastName.trim() &&
    !regEmail.trim() &&
    !regPhone.trim() &&
    !regPassword.trim() &&
    !regPasswordConfirm.trim()
  ) {
    return next(new AppError("All fields are required!", 400));
  }

  if (!regFirstName.trim()) {
    return next(new AppError("Firstname is required!", 400));
  }

  if (!regLastName.trim()) {
    return next(new AppError("Lastname is required!", 400));
  }

  if (!regEmail.trim()) {
    return next(new AppError("Email is required!", 400));
  }

  if (!regPhone.trim()) {
    return next(new AppError("Phone number is required!", 400));
  }

  if (!regPassword.trim()) {
    return next(new AppError("Password is required!", 400));
  }

  if (!regPasswordConfirm.trim()) {
    return next(new AppError("Password Confirmation is required!", 400));
  }

  if (!regTermsConditions) {
    return next(new AppError("Please accept terms & conditions.", 400));
  }

  if (!validator.isLength(regFirstName.trim(), { min: 3 })) {
    return next(new AppError("Firstname must be at least 3 characters", 400));
  }

  if (!validator.isAlpha(regFirstName, "en-US", { ignore: " ." })) {
    return next(
      new AppError(
        "Firstname must be alphabetical only (e.g. Dr. John, Joe)",
        400
      )
    );
  }

  if (!validator.isLength(regLastName.trim(), { min: 3 })) {
    return next(new AppError("Lastname must be at least 3 characters", 400));
  }

  if (!validator.isAlpha(regLastName, "en-US", { ignore: " ." })) {
    return next(
      new AppError(
        "Lastname must be alphabetical only (e.g. Dr. John, Joe)",
        400
      )
    );
  }

  if (!validator.isEmail(regEmail)) {
    return next(new AppError("Invalid Email!", 400));
  }

  if (!validator.isMobilePhone(regPhone, "en-PH")) {
    return next(
      new AppError(
        "Invalid Phone Number! Spaces are not allowed",
        400
      )
    );
  }

  const pwdScore = validator.isStrongPassword(regPassword, {
    minLength: 8,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    returnScore: true,
  });

  if (pwdScore < 50) {
    return next(
      new AppError(
        "Password must be at least 8 characters including uppercase, numbers, and symbols",
        400
      )
    );
  }

  if (!validator.equals(regPassword, regPasswordConfirm)) {
    return next(new AppError("Passwords do not match!", 400));
  }

  try {
    await createNewUser({
      first_name: regFirstName.trim(),
      last_name: regLastName.trim(),
      email: regEmail.trim(),
      password: regPassword.trim(),
      phone: regPhone.trim(),
      role: "customer",
      terms_accepted: regTermsConditions,
    });

    return res.status(200).json({
      msg: "Registered Successfully!",
      pwd_score: pwdScore,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Failed query")) {
      return next(new AppError("Email already exists!", 400));
    }

    return next(
      new AppError("Cannot create new account. Please try again.", 400)
    );
  }
};