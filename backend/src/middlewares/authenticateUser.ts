import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'


declare global {
    namespace Express {
        interface Request {
            userId?:string;
        }
    }
}

export const authenticateUser = (req:Request,res:Response,next:NextFunction) => {
    if(!req.cookies?.auth_token) return res.status(400).json({"success":false,"message":"No auth_token cookie found"});
    const decoded = jwt.verify(req.cookies.auth_token,process.env.JWT_SECRET as string) as JwtPayload;
    const userId = decoded.userId;
    req.userId = userId;
    next();
}
