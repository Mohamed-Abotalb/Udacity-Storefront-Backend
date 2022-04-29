import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";

const unAuthorized = (next : NextFunction) => {
    const error = new Error('Login Error, please enter a valid info');
    next(error);
}

const validateToken = (req : Request, res : Response, next : NextFunction) => {
    try {   
        // get authorization header
        const authHeader : string | undefined = req.get('Authorization');
        
        // check if there is authorization header or not
        if (authHeader) {
            const token = authHeader.split(' ')[1];

            if (token) {
                const decodeToken = jwt.verify(token, config.tokenSecret as string);

                if (decodeToken) next();

                // failed to authorize 
                else unAuthorized(next);
            } else {

                // no token provided
                unAuthorized(next);
            }
        } else {
            // no authorization header
            unAuthorized(next);
        }

    } catch (error) {
        unAuthorized(next);
    }
}

export default validateToken;