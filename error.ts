import { NextFunction, Request, Response } from "express";
import { AppError } from "./utils/AppError";

 const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    if(err.status){
       return res.status(err.status).json({ error: err.message })
    }
    return res.status(500).json({url: '/status-error'})
}

export default errorHandler;