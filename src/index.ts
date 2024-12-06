import express, {Request, Response} from 'express';
import {json} from 'body-parser';
import authRoutes from './routes/authRoutes';
import conversationRoutes from './routes/conversationsRoutes';
import messagesRoutes from './routes/messagesRoutes';

const app = express();
app.use(json());

app.use('/api/auth', authRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messagesRoutes);

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});