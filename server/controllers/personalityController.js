import { PERSONALITIES } from '../../client/js/data/personalities.js';

export const getPersonalities = (req, res) => {
  const { id } = req.query;
  if (id) {
    const person = PERSONALITIES.find(p => p.id === id);
    if (person) return res.json(person);
    return res.status(404).json({ error: `Personality ${id} not found.` });
  }
  res.json({
    total: PERSONALITIES.length,
    personalities: PERSONALITIES
  });
};
