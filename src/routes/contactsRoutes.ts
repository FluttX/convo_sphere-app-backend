import { Router } from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import { addContact, fetchContacts, fetchRecentContacts } from '../controllers/contactsController';

const router = Router();

router.get('/', verifyToken, fetchContacts);
router.post('/', verifyToken, addContact);
router.get('/recent', verifyToken, fetchRecentContacts);

export default router;