import {Request, Response} from 'express';
import pool from '../models/db';
import { validate as isUuid } from "uuid";
import { AI_BOT_ID } from '../utils/config';

export const fetchAllConversationsByUserId = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized: Authentication token is missing.' });
        }

        const query = `
            SELECT 
                c.id AS conversation_id, 
                CASE
                    WHEN c.participant_one = $1 THEN u2.username
                    ELSE u1.username
                END AS participant_name,
                CASE
                    WHEN c.participant_one = $1 THEN u2.profile_image
                    ELSE u1.profile_image
                END AS participant_image,
                m.content AS last_message, 
                m.created_at AS last_message_time
            FROM conversations c
            JOIN users u1 ON u1.id = c.participant_one
            JOIN users u2 ON u2.id = c.participant_two
            LEFT JOIN LATERAL (
                SELECT content, created_at
                FROM messages
                WHERE conversation_id = c.id
                ORDER BY created_at DESC
                LIMIT 1
            ) m ON true
            WHERE c.participant_one = $1 OR c.participant_two = $1
            ORDER BY m.created_at DESC;
        `;

        const { rows } = await pool.query(query, [userId]);

        res.json(rows.length > 0 ? rows : []);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ message: 'Failed to fetch conversations' });
    }
}

export const checkOrCreateConversation = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized: Authentication token is missing.' });
        }

        const {contactId} = req.body;

        if (!contactId) {
            res.status(400).json({ message: 'Bad Request: Contact ID is required.' });
            return;
        }

        if (!isUuid(contactId)) {
            res.status(400).json({ message: 'Bad Request: Invalid contact ID.' });
            return;
        }
        
        if(userId === contactId) {
            res.status(400).json({ message: 'Bad Request: Cannot create a conversation with yourself.' });
            return;
        }

        const existingConversation = await pool.query(
            `
            SELECT id FROM conversations 
            WHERE (participant_one = $1 AND participant_two = $2)
            OR (participant_one = $2 AND participant_two = $1)
            LIMIT 1
            `,
            [userId, contactId]
        );

        if (existingConversation.rows.length > 0) {
            res.json({ conversationId: existingConversation.rows[0].id });
            return;
        }

        const newConversation = await pool.query(
            `
            INSERT INTO conversations (participant_one, participant_two)
            VALUES ($1, $2)
            RETURNING id
            `,
            [userId, contactId]
        );

        res.json({ conversationId: newConversation.rows[0].id });

    } catch (error) {
        console.error('Error checking or creating conversations:', error);
        res.status(500).json({ message: 'Failed to checking or create conversation' });
    }
}

export const getDailyQuestion = async (req: Request, res: Response) => {
    try {
        const conversationId = req.params.id;

        if(!conversationId) {
            res.status(400).json({ message: 'Bad Request: Conversation ID is required.' });
            return;
        }

        if (!isUuid(conversationId)) {
            res.status(400).json({ message: "Invalid Conversation ID format" });
            return;
        }

        const result = await pool.query(
            `
            SELECT content FROM messages 
            WHERE conversation_id = $1 AND sender_id = $2
            ORDER BY created_at DESC
            LIMIT 1
            `,
            [conversationId, AI_BOT_ID]
        );

        if(result.rows.length === 0) {
            res.status(404).json({ message: 'No daily question found for this conversation.' });
            return;
        }

        res.json({'question': result.rows[0].content});

    } catch(err) {
        console.error('Error fetching daily question:', err);
        res.status(500).json({ message: 'Failed to fetch daily question' });
    }
}

