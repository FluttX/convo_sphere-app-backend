import {Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';


export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(403).json({ message: 'No token provided' });
            return;
        }

        const token = authHeader.split(' ')[1];

        const secretKey = process.env.JWT_TOKEN || 'convo_sphere_secret_key';
        const decoded = jwt.verify(token, secretKey);

        req.user = decoded as { id: string };
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};