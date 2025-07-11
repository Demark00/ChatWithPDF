import { Request, Response } from "express";
import { PrismaClient, Role } from "@prisma/client";
import { getLLMResponse } from "../services/llmService";
import { buildPromptFromChunks } from "../services/promptService";
import { selectRelevantChunks } from "../services/chunkSelector";

const prisma = new PrismaClient()
export const chatController = async (req: Request, res: Response) => {
    const { documentId, question } = req.body
    const userId = req.user?.uid;

    if (!documentId || !question || !userId) {
        res.status(400).json({ error: "Missing documentId or question" })
        return;
    }

    try {
        // Validate document ownership
        const document = await prisma.document.findFirst({
            where: {
                id: documentId,
                userId: userId
            }
        })

        if (!document) {
            res.status(403).json({ error: "Unauthorized or document not found" })
            return;
        }

        // Store User Question
        const userMessage = await prisma.chatMessage.create({
            data: {
                documentId,
                userId,
                role: Role.user,
                content: question,
            }
        });

        // Fetch Document Chunks as Context
        const chunks = await selectRelevantChunks(documentId, question)

        // Build prompt using chunks and question
        const prompt = buildPromptFromChunks(chunks.map(c => c.content), question);

        // Get LLM Response
        const llmResponse = await getLLMResponse(prompt)

        // Store Assistant Response
        const assistantMessage = await prisma.chatMessage.create({
            data: {
                documentId,
                userId: userId,
                role: Role.assistant,
                content: llmResponse
            }
        })

        res.status(200).json({
            response: llmResponse,
            messages: [userMessage, assistantMessage]
        })

    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ error: "Internal server error during chat" });
    }
}