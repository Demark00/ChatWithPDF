import { Request, Response} from "express"
import { PrismaClient } from "@prisma/client"
import { uploadToS3 } from "../services/s3Service";
import { findOrCreateUser } from "../services/userService";
import { extractTextFromPdf, chunkText } from "../services/pdfService";
import { getEmbedding } from "../services/embedder";


const prisma = new PrismaClient();

export const uploadController = async (req: Request, res: Response): Promise<void> => {
    const file = req.file
    const firebaseUser = req.user;

    if (!file || !firebaseUser) {
        res.status(400).json({ error: "Missing file or user" })
        return;
    };

    try {
        const user = await findOrCreateUser(firebaseUser.uid, firebaseUser.email);
        const { key, url } = await uploadToS3(file.buffer, file.originalname, file.mimetype);
        const fullText = await extractTextFromPdf(file.buffer);
        const chunks = chunkText(fullText);

        const chunksWithEmbeddings = await Promise.all(
            chunks.map(async (content, index)=>({
                chunkIndex: index,
                content,
                embedding: await getEmbedding(content)
            }))
        );

        const document = await prisma.document.create({
            data: {
                userId: user.id,
                fileName: file.originalname,
                storagePath: key,
                chunks: {
                    create: chunksWithEmbeddings
                }
            },
            include: { chunks: true }
        });

        res.status(200).json({
            message: 'File Uploaded Successfully',
            fileUrl: url,
            document
        });

    } catch (error) {
        console.log("Upload Error", error)
        res.status(500).json({error: "Upload Failed"})
    }
}