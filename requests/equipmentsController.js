const { db } = require('../config/pg.config');

/* Получение данных из БД */

module.exports.getEquipmentsList = async function (req, res) {
    try {
        const { order, sort } = req.query
        const result = await db.manyOrNone(`select equipment_id, equipment_type_name, 
        equipment_status_name, 
        equipment_responsible_l_name || ' ' || equipment_responsible_f_name || ' ' || equipment_responsible_s_name as equipment_responsible_full_name,
        equipment_name, inventory_number,
        division_name, equipment_responsible_position
        from equipment
        join equipment_type 
        on equipment.equipment_type_id = equipment_type.equipment_type_id
        join equipment_status on equipment.equipment_status_id = equipment_status.equipment_status_id
        join equipment_responsible on equipment.equipment_responsible_id = equipment_responsible.equipment_responsible_id
        join division on equipment_responsible.division_id = division.division_id
        order by ${order} ${sort};`)
        return res.status(200).json(result)
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
}

module.exports.getEquipmnetType = async function (req, res) {
    try {
        const result = await db.manyOrNone(`select * from equipment_type;`)
        return res.status(200).json(result)
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
}

module.exports.getEquipmnetStatus = async function (req, res) {
    try {
        const result = await db.manyOrNone(`select * from equipment_status;`)
        return res.status(200).json(result)
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
}

module.exports.getEquipmnetResponsible = async function (req, res) {
    try {
        const result = await db.manyOrNone(`select equipment_responsible_id, 
        equipment_responsible_l_name || ' ' || equipment_responsible_f_name || ' ' || equipment_responsible_s_name 
        as equipment_responsible_full_name, division_id, equipment_responsible_position
        from equipment_responsible;`)
        return res.status(200).json(result)
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
}

module.exports.getDivision = async function (req, res) {
    try {
        const result = await db.manyOrNone(`select * from division;`)
        return res.status(200).json(result)
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
}

/* Добавление новых данных */

module.exports.addEquipment = async function (req, res) {
    try {
        const { equipment_type_id, equipment_status_id, equipment_responsible_id, equipment_name, inventory_number } = req.body;
        const result = await db.oneOrNone(`insert into equipment(equipment_type_id, 
            equipment_status_id, equipment_responsible_id, equipment_name, inventory_number) values
            (${ equipment_type_id }, ${ equipment_status_id }, ${ equipment_responsible_id }, '${ equipment_name }', '${ inventory_number }');`)
        return res.status(200).json(result)
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
}

module.exports.addEquipmnetType = async function (req, res) {
    try {
        const result = await db.one()
        return res.status(200).json(result)
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
}

module.exports.addEquipmnetStatus = async function (req, res) {
    try {
        const result = await db.one()
        return res.status(200).json(result)
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
}

module.exports.addEquipmnetResponsible = async function (req, res) {
    try {
        const result = await db.one()
        return res.status(200).json(result)
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
}

module.exports.addDivision = async function (req, res) {
    try {
        const { division_name } = req.body;
        const result = await db.one(`INSERT INTO division(division_name) VALUES ('${division_name}');`)
        return res.status(200).json(result)
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
}
/* Обновление существующих данных */
module.exports.updateEquipmentsList = async function (req, res) {
    try {
        const result = await db.one()
        return res.status(200).json(result)
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
}

module.exports.updateEquipmnetType = async function (req, res) {
    try {
        const result = await db.one()
        return res.status(200).json(result)
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
}

module.exports.updateEquipmnetStatus = async function (req, res) {
    try {
        const result = await db.one()
        return res.status(200).json(result)
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
}

module.exports.updateEquipmnetResponsible = async function (req, res) {
    try {
        const result = await db.one()
        return res.status(200).json(result)
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
}

module.exports.updateDivision = async function (req, res) {
    try {
        const { division_name } = req.body;
        const result = await db.one(`INSERT INTO division(division_name) VALUES ('${division_name}');`)
        return res.status(200).json(result)
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
}