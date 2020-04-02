const express = require('express');
const router = express.Router();
const eos = require('../services/eos.service')

router.post("/take-action", eos.takeAction);

module.exports = router;