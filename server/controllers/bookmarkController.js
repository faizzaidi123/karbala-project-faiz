import Bookmark from '../models/Bookmark.js';
import { getMongoStatus } from '../config/db.js';

let inMemoryBookmarks = [];

export const getBookmarks = async (req, res) => {
  try {
    if (getMongoStatus()) {
      const bms = await Bookmark.find().sort({ savedAt: -1 });
      return res.json(bms);
    }
    res.json(inMemoryBookmarks);
  } catch (err) {
    res.json(inMemoryBookmarks);
  }
};

export const addBookmark = async (req, res) => {
  try {
    const { locationId, name, arabicName, category, image } = req.body;
    if (!locationId || !name) {
      return res.status(400).json({ error: 'locationId and name are required' });
    }

    if (getMongoStatus()) {
      const existing = await Bookmark.findOne({ locationId });
      if (existing) {
        return res.json({ message: 'Bookmark already saved', bookmark: existing });
      }
      const newBm = new Bookmark({ locationId, name, arabicName, category, image });
      await newBm.save();
      return res.status(201).json(newBm);
    }

    const existingMem = inMemoryBookmarks.find(b => b.locationId === locationId);
    if (!existingMem) {
      const item = { locationId, name, arabicName, category, image, savedAt: new Date() };
      inMemoryBookmarks.push(item);
      return res.status(201).json(item);
    }
    res.json({ message: 'Bookmark already saved', bookmark: existingMem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    if (getMongoStatus()) {
      await Bookmark.deleteOne({ locationId: id });
    }
    inMemoryBookmarks = inMemoryBookmarks.filter(b => b.locationId !== id);
    res.json({ success: true, removed: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
