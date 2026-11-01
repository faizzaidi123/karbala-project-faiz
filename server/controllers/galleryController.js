import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const catalogPath = path.join(__dirname, '../../client/assets/images_catalog.json');
let cachedCatalog = [];

function loadCatalog() {
  try {
    if (fs.existsSync(catalogPath)) {
      cachedCatalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    }
  } catch (e) {
    console.error('Error reading gallery catalog:', e.message);
  }
}

loadCatalog();

export const getGallery = (req, res) => {
  if (cachedCatalog.length === 0) loadCatalog();

  const { category, page = 1, limit = 60, search } = req.query;
  let filtered = [...cachedCatalog];

  if (category && category !== 'all') {
    filtered = filtered.filter(img => img.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(img => 
      (img.title && img.title.toLowerCase().includes(q)) ||
      (img.filename && img.filename.toLowerCase().includes(q)) ||
      (img.category && img.category.toLowerCase().includes(q))
    );
  }

  const p = parseInt(page, 10) || 1;
  const lim = parseInt(limit, 10) || 60;
  const startIndex = (p - 1) * lim;
  const paginated = filtered.slice(startIndex, startIndex + lim);

  res.json({
    total: filtered.length,
    page: p,
    limit: lim,
    totalPages: Math.ceil(filtered.length / lim),
    images: paginated
  });
};
