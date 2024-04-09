const express = require('express');
const router = express.Router();
const controller = require('../requests/equipments')

router.get('/equipments', controller.getEquipmentsList)

module.exports = router;
