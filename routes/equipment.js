const express = require('express');
const router = express.Router();
const controller = require('../requests/equipmentsController');

/* Регистрация и авторизация */
router.post('/registration', controller.registration)
router.post('/login', controller.login)

/* Запросы для получения данных из таблицы */
router.get('/equipments', controller.getEquipmentsList);
router.get('/status', controller.getEquipmnetStatusList);
router.get('/types', controller.getEquipmnetTypeList);
router.get('/responsible', controller.getEquipmnetResponsibleList);
router.get('/division', controller.getDivisionList);

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
