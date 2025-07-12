import { PrismaClient } from "@prisma/client";
import { getEmbedding } from "./embedder";

const prisma = new PrismaClient();

function cosineSim(a: number[], b: number[]): number {
    const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
    const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
    return dot / (magA * magB);
}

export const selectRelevantChunks = async (
    documentId: string,
    question: string,
    topK: number = 8
) => {
    const questionEmbedding = await getEmbedding(question);

    const chunks = await prisma.documentChunk.findMany({
        where: { documentId },
        select: {
            content: true,
            embedding: true,
            chunkIndex: true
        }
    });

    const scored = chunks.map(chunk => ({
        content: chunk.content,
        chunkIndex: chunk.chunkIndex,
        score: cosineSim(questionEmbedding, chunk.embedding as number[])
    }))

    return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
        .sort((a,b) => a.chunkIndex - b.chunkIndex)
}