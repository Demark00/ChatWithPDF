import { Router, Request, Response } from "express";
import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken";
import { upload } from "../middleware/uploadMiddleware"
import { uploadController } from "../controller/upload.controller";
import { getDocumentsController } from "../controller/documents.controller";
import { chatController } from "../controller/chat.controller";
import { getChatMessagesController } from "../controller/chatMessages.controller";
import { deleteDocumentController } from "../controller/deleteDocument.controller";

const router = Router();

router.get("/me", verifyFirebaseToken, (req: Request, res: Response) => {
  res.json({ user: req.user });
});

// Upload Route
router.post('/upload', verifyFirebaseToken, upload.single("file"), uploadController)

// Get Uploaded Documents
router.get('/documents', verifyFirebaseToken, getDocumentsController)

// Delete Document
router.delete('/documents', verifyFirebaseToken, deleteDocumentController)

// Chat Route
router.post('/chat', verifyFirebaseToken, chatController)


// Get Chat Messages
router.get('/chat', verifyFirebaseToken, getChatMessagesController)

export default router;
