const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'visitorCount.json');

const ensureFile = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ count: 0 }), 'utf-8');
  }
};

const incrementVisitorCount = async (req, res, next) => {
  try {
    ensureFile();
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const stored = JSON.parse(raw);
    const counts = typeof stored.counts === 'object' && stored.counts !== null
      ? stored.counts
      : { portfolio: stored.count || 0, easterEgg: 0, github: 0 };
    const scope = ['portfolio', 'easterEgg', 'github'].includes(req.body?.scope)
      ? req.body.scope
      : 'portfolio';
    counts[scope] = (counts[scope] || 0) + 1;
    fs.writeFileSync(DATA_FILE, JSON.stringify({ counts }), 'utf-8');
    res.status(200).json({ count: counts[scope], counts });
  } catch (error) {
    next(error);
  }
};

module.exports = { incrementVisitorCount };