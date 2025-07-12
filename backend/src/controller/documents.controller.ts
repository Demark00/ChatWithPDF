import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const getDocumentsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const documents = await prisma.document.findMany({
      where: { userId: user.id }
    });

    if (documents.length === 0) {
      res.status(200).json({ message: "No documents found" });
      return;
    }

    res.status(200).json({
      message: "Documents found",
      documents
    });

  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
