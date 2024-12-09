import {Request, Response} from 'express';
import pool from '../models/db';
import { validate as isUuid } from "uuid";

export const fetchAllMessagesByConversationsId = async (req: Request, res: Response) => {
    const {conversationId} = req.params;

    if (!conversationId || !isUuid(conversationId)) {
        res.status(400).json({ message: "Invalid Conversation ID format" });
        return;
    }

    try{
        const result = await pool.query(
            `
            SELECT 
                m.id, m.content, m.sender_id, m.conversation_id, m.created_at
            FROM messages m
            WHERE m.conversation_id = $1
            ORDER BY m.created_at ASC
            `,
            [conversationId]
        );

        res.status(200).json(result.rows);
    } catch(error) {
        console.error("Error fetching messages:", error); 
        res.status(500).json({message: 'Failed to fetch messages'});
    }
};

export const saveMessage = async (conversationId: string, senderId: string, content: string) => {
    
    if (!conversationId || !senderId || !content) {
        throw new Error("All fields (conversationId, senderId, and content) are required");
    }

    try{
        const result = await pool.query(
            `
            INSERT INTO messages (conversation_id, sender_id, content)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
            [conversationId, senderId, content]
        );

        return result.rows[0];
    } catch(error) {
        console.error("Error saving messages:", error); 
        throw new Error('Failed to save the message');
    }
};