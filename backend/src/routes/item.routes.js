import { Router } from 'express';
import { createItem, getItemByCode, getItems } from '../controllers/item.controller.js';

const router = Router();

router.post('/items', createItem);
router.get('/items', getItems);
router.get('/items/:code', getItemByCode);

export default router;
