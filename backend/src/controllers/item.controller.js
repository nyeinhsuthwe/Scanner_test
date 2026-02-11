import { v4 as uuidv4 } from 'uuid';
import { Item } from '../models/item.model.js';

export const createItem = async (req, res, next) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !description || price === undefined) {
      return res.status(400).json({ message: 'name, description and price are required' });
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ message: 'price must be a valid non-negative number' });
    }

    const code = uuidv4();

    const item = await Item.create({
      name,
      description,
      price: numericPrice,
      code
    });

    return res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

export const getItems = async (req, res, next) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 }).lean();
    return res.json(items);
  } catch (error) {
    next(error);
  }
};

export const getItemByCode = async (req, res, next) => {
  try {
    const { code } = req.params;

    const item = await Item.findOne({ code }).lean();
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    return res.json(item);
  } catch (error) {
    next(error);
  }
};
