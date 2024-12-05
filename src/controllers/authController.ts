import {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import pool from '../models/db';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET ||  'convo_sphere_secret_key';

const validateInput = (username: string, email: string, password: string) => {
    const errors: { field: string; message: string }[] = [];

    if (!username || username.trim().length < 3) {
        errors.push({ field: 'username', message: 'Username must be at least 3 characters long.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push({ field: 'email', message: 'Invalid email address.' });
    }

    if (!password || password.length < 6) {
        errors.push({ field: 'password', message: 'Password must be at least 6 characters long.' });
    }

    return errors;
};

export const register = async(req: Request, res: Response) => {
    const {username, email, password} = req.body;

    const errors = validateInput(username, email, password);
    if (errors.length > 0) {
        res.status(400).json({ message: 'Validation failed', errors, status: false });
        return;
    }

    try{
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        );

        const user = result.rows[0];

        res.status(201).json({
            message: 'User registration successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
            status: true,
        });
    } catch (err) {
       
        let errorMessage = 'An unexpected error occurred.';
        let statusCode = 500;
        const fieldErrors: { field: string; message: string }[] = [];

        if (err instanceof Error) {
            if ('code' in err) {
                const errorWithCode = err as { code: string; detail?: string; constraint?: string };

                if (errorWithCode.code === '23505') {
                    if (errorWithCode.constraint === 'users_username_key') {
                        fieldErrors.push({ field: 'username', message: 'Username already exists.' });
                        errorMessage = 'One or more fields have invalid input.';
                        statusCode = 400;
                    } else if (errorWithCode.constraint === 'users_email_key') {
                        fieldErrors.push({ field: 'email', message: 'Email already exists.' });
                        errorMessage = 'One or more fields have invalid input.';
                        statusCode = 400;
                    }
                }
            }
        }

        res.status(statusCode).json({
            message: errorMessage,
            errors: fieldErrors.length > 0 ? fieldErrors : undefined,
            status: false,
        });
    }
}

export const login = async(req: Request, res: Response) => {
    
}