import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import { fetchAllMessagesByConversationsId } from "../controllers/messagesController";

const router = Router();

router.get("/:conversationId", verifyToken, fetchAllMessagesByConversationsId);

export default router;