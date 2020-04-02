const express = require('express');
const router = express.Router();
const eos = require('../services/eos.service')

router.post("/take-action", eos.takeAction);
router.post("/test", eos.test)

module.exports = router;