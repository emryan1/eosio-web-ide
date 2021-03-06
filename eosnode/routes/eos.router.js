const express = require('express');
const router = express.Router();
const eos = require('../services/eos.service')

router.post("/take-action", eos.takeAction);
router.get("/get-table", eos.getTable);
router.get("/get-balance", eos.getBalance);
router.get("/get-record", eos.getRecord);

module.exports = router;