import { MUHARRAM_DAYS } from '../../client/js/data/timeline.js';

export const getTimeline = (req, res) => {
  const { day } = req.query;
  if (day) {
    const dayData = MUHARRAM_DAYS.find(d => d.dayNumber === parseInt(day, 10));
    if (dayData) return res.json(dayData);
    return res.status(404).json({ error: `Muharram day ${day} not found.` });
  }
  res.json({
    totalDays: MUHARRAM_DAYS.length,
    startDate: '2 Muharram 61 AH',
    endDate: '10 Muharram 61 AH (Ashura)',
    days: MUHARRAM_DAYS
  });
};
