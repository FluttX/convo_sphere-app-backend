import cron from 'node-cron';
import pool from '../models/db'
import { generateDailyQuestion } from '../services/openaiService';
import { AI_BOT_ID } from '../utils/config';


cron.schedule('0 9 * * *', async () => {
    try {
        console.log('Generating daily question...');
        const conversations = await pool.query(`SELECT id FROM conversations`);
        for(const conversation of conversations.rows) {
            const question = await generateDailyQuestion();

            await pool.query(
                `
                INSERT INTO messages (conversation_id, sender_id, content)
                VALUES ($1, $2, $3)
                `,
                [conversation.id, AI_BOT_ID, question]
            );

            console.log(`Daily question sent to conversation ${conversation.id}: ${question}`);
        }

    } catch(e) {
        console.error('Error generating daily question:', e);
    }
});