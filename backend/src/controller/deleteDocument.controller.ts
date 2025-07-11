import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const deleteDocumentController = async (req: Request, res: Response): Promise<void> => {
    const { documentId } = req.body;

    if (!documentId) {
        res.status(400).json({ error: "Document ID was not provided" })
        return;
    }

    try {
        const existDocument = await prisma.document.findUnique({
            where: {
                id: documentId
            }
        })

        if (!existDocument) {
            res.status(404).json({ error: "Document not found" })
            return;
        }

        await prisma.chatMessage.deleteMany({
            where:{
                documentId
            }
        })
        
        await prisma.documentChunk.deleteMany({
            where:{
                documentId
            }
        })

        await prisma.document.delete({
            where: {
                id: documentId
            }
        })

        res.status(200).json({message: "Document deleted successfully"});
    } catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}