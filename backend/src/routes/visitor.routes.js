const express = require('express');
const router = express.Router();
const { incrementVisitorCount } = require('../controllers/visitor.controller');

router.post('/increment', incrementVisitorCount);

module.exports = router;