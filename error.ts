import { NextFunction, Request, Response } from "express";

 const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if(err.status){
       return res.status(err.status).json({ error: err.message })
    }
    return res.status(500).json({url: '/status-error'})
}

export default errorHandler;