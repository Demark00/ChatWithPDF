import {Request, Response, NextFunction, RequestHandler} from "express";
import admin from "../firebase/admin"

export const verifyFirebaseToken: RequestHandler = async (req: Request, res: Response, next: NextFunction)=>{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        res.status(401).json({error: "No token provided"})
        return;
    }

    const idToken = authHeader.split("Bearer ")[1];

    try{
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next()
    }catch(error){
        console.error("Firebase token verification failed:", error);
        res.status(401).json({error: "Invalid token"});
        return;
    }
}