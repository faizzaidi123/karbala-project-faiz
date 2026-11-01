import { CERTAINTY_EXPLANATIONS, CERTAINTY_LEVELS } from '../../client/js/data/certainty_explanations.js';

export const getCertainty = (req, res) => {
  const { key } = req.query;
  if (key) {
    const item = CERTAINTY_EXPLANATIONS[key];
    if (item) return res.json(item);
    return res.status(404).json({ error: `Certainty record for ${key} not found.` });
  }
  res.json({
    levels: CERTAINTY_LEVELS,
    explanations: CERTAINTY_EXPLANATIONS
  });
};
