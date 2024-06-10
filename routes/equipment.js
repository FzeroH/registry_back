const express = require('express');
const router = express.Router();
const controller = require('../controller/equipmentsController');
const middleware = require('../middleware/checkUser');

/* Регистрация и авторизация */
router.post('/registration', controller.registration)
router.post('/login', controller.login)

/* Запросы для получения данных из таблицы */
router.get('/equipments', middleware.checkUser, controller.getEquipmentsList);
router.get('/status', middleware.checkEmployee, controller.getEquipmnetStatusList);
router.get('/responsible', middleware.checkEmployee, controller.getEquipmnetResponsibleList);
router.get('/division', middleware.checkEmployee, controller.getDivisionList);
router.get('/role', middleware.checkAdmin, controller.getDivisionList);

/* Запросы для добавления данных в таблицы */
router.post('/equipments', middleware.checkEmployee, controller.addEquipment);
router.post('/status', middleware.checkAdmin, controller.addEquipmnetStatus);
router.post('/division', middleware.checkAdmin, controller.addDivision);

/* Запросы для обновления данных в таблицы */
router.put('/equipments', middleware.checkEmployee, controller.updateEquipment);
router.put('/status', middleware.checkAdmin, controller.updateEquipmnetStatus);
router.put('/division', middleware.checkAdmin, controller.updateDivision);
router.put('/user', middleware.checkAdmin, controller.updateUser);

module.exports = router;
