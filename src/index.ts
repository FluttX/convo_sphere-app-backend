import express, {Request, Response} from 'express';
import {json} from 'body-parser';
import authRoutes from './routes/authRoutes';

const app = express();
app.use(json());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});