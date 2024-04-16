const express = require('express');
const router = express.Router();
const controller = require('../requests/equipmentsController');

/* Запросы для получения данных из таблицы */
router.get('/equipments', controller.getEquipmentsList);
router.get('/status', controller.getEquipmnetStatus);
router.get('/types', controller.getEquipmnetType);
router.get('/responsible', controller.getEquipmnetResponsible);
router.get('/division', controller.getDivision);

/* Запросы для добавления данных в таблицы */
router.post('/equipments', controller.addEquipment);
router.post('/status', controller.addEquipmnetStatus);
router.post('/types', controller.addEquipmnetType);
router.post('/responsible', controller.addEquipmnetResponsible);
router.post('/division', controller.addDivision);

/* Запросы для обновления данных в таблицы */
router.put('/equipments', controller.updateEquipment);
router.put('/status', controller.updateEquipmnetStatus);
router.put('/types', controller.updateEquipmnetType);
router.put('/responsible', controller.updateEquipmnetResponsible);
router.put('/division', controller.updateDivision);
module.exports = router;
