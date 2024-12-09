import {Request, Response} from 'express';
import pool from '../models/db';
import { validate as isUuid } from "uuid";

export const fetchContacts = async (req: Request, res: Response) => {
    try{
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized: Authentication token is missing.' });
            return;
        }

        const query = `
        SELECT 
            c.id AS contact_id,
            u.id AS user_id,
            u.username, 
            u.email 
        FROM contacts c
        INNER JOIN users u ON c.contact_id = u.id
        WHERE c.user_id = $1
        ORDER BY u.username ASC
        `;
        
        const { rows } = await pool.query(query, [userId]); 

        res.status(200).json(rows);
        
    } catch(error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'An error occurred while fetching contacts.' });
    }
}


export const addContact = async (req: Request, res: Response) => {
    try{
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized: Authentication token is missing.' });
            return;
        }
        
        const { contact_id } = req.body;
        if (!contact_id) {
            res.status(400).json({ message: 'Bad Request: Contact ID is required.' });
            return;
        }

        if (!isUuid(contact_id)) {
            res.status(400).json({ message: "Invalid Contact ID format" });
            return;
        }

        const contactExists = await pool.query(`SELECT id FROM users WHERE id = $1`,[contact_id]);

        if(contactExists.rowCount === 0) {
            res.status(404).json({ message: 'Not Found: Contact not found.' });
            return;
        }

        const query = `
            INSERT INTO contacts (user_id, contact_id)
            VALUES ($1, $2)
            ON CONFLICT (user_id, contact_id) DO NOTHING;
        `;

        const result = await pool.query(query, [userId, contact_id]);

        if (result.rowCount === 0) {
            res.status(200).json({ message: 'Contact already exists.' });
            return;
        }

        res.status(201).json({ message: 'Contact added successfully.' });
        
    } catch(error) {
        console.error('Error adding contact:', error);
        res.status(500).json({ message: 'An error occurred while adding the contact.' });
    }
}