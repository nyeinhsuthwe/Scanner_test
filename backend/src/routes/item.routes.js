import { Router } from 'express';
import { createItem, getItemByCode } from '../controllers/item.controller.js';

const router = Router();

router.post('/items', createItem);
router.get('/items/:code', getItemByCode);

export default router;
