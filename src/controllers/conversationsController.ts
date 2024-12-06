import {Request, Response} from 'express';
import pool from '../models/db';

export const fetchAllConversationsByUserId = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized: User ID is missing' });
        }

        const query = `
            SELECT 
                c.id AS conversation_id, 
                CASE
                    WHEN c.participant_one = $1 THEN u2.username
                    ELSE u1.username
                END AS participant_name,
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
};