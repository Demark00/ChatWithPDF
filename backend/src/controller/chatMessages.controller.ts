import {Response, Request} from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getChatMessagesController = async (req: Request, res: Response)=>{
    const {documentId, userId} = req.query;

    if(!documentId || !userId){
        res.status(400).json({error: "Document or User was not provided"});
        return;
    }

    try{
        const messages = await prisma.chatMessage.findMany({
            where:{
                documentId: typeof documentId === "string" ? documentId : Array.isArray(documentId) ? documentId[0] : "",
                userId: typeof userId === "string" ? userId : Array.isArray(userId) ? userId[0] : ""
            },
            orderBy: {timestamp: 'asc'}
        })

        res.json({messages})
    }catch(error){
        console.error("Failed to fetch messages", error);
        res.status(500).json({error: "Internal Server Error"});
    }
}