import { PRESENT_DAY_LOCATIONS, HISTORICAL_61AH_LOCATIONS } from '../../client/js/data/locations.js';

export const getLocations = (req, res) => {
  const { mode } = req.query;
  if (mode === '61ah') {
    return res.json({ mode: '61ah', locations: HISTORICAL_61AH_LOCATIONS });
  } else if (mode === 'present') {
    return res.json({ mode: 'present', locations: PRESENT_DAY_LOCATIONS });
  }
  res.json({
    present: PRESENT_DAY_LOCATIONS,
    historical: HISTORICAL_61AH_LOCATIONS
  });
};

export const getLocationById = (req, res) => {
  const { id } = req.params;
  const loc = PRESENT_DAY_LOCATIONS.find(l => l.id === id) || HISTORICAL_61AH_LOCATIONS.find(l => l.id === id);
  if (!loc) return res.status(404).json({ error: 'Location not found' });
  res.json(loc);
};
