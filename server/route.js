'use strict';

const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'static', 'index.html'));
});
router.get('/rooms', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'static', 'rooms.html'));
});

module.exports = router;