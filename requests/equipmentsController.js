const { db } = require('../config/pg.config');

/* Получение данных из БД */

module.exports.getEquipmentsList = async function (req, res) {
    try {
        const { order, sort } = req.query
        const result = await db.manyOrNone(`select equipment_id, equipment_type_name, 
        equipment_status_name, 
        equipment_responsible_l_name || ' ' || equipment_responsible_f_name || ' ' || equipment_responsible_s_name as equipment_responsible_full_name,
        equipment.equipment_responsible_id, equipment.equipment_status_id, 
        equipment.equipment_type_id,
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
        as equipment_responsible_full_name, equipment_responsible.division_id, division_name, equipment_responsible_position
        from equipment_responsible join division on equipment_responsible.division_id = division.division_id;`)
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
        const { equipment_type_name } = req.body;
        const result = await db.oneOrNone(`insert into equipment_type(equipment_type_name) values ('${ equipment_type_name }');`)
        return res.status(200).json(result)
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
}

module.exports.addEquipmnetStatus = async function (req, res) {
    try {
        const { equipment_status_name } = req.body;
        const result = await db.oneOrNone(`insert into equipment_status(equipment_equipment_status_name) values ('${ equipment_status_name }');`)
        return res.status(200).json(result)
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
}

module.exports.addEquipmnetResponsible = async function (req, res) {
    try {
        const { 
            division_id, 
            equipment_responsible_f_name, 
            equipment_responsible_s_name,
            equipment_responsible_l_name, 
            equipment_responsible_position } = req.body;
        const result = await db.oneOrNone(`insert into equipment_responsible(division_id, equipment_responsible_f_name, equipment_responsible_s_name,
            equipment_responsible_l_name, equipment_responsible_position) values 
            (${ division_id },'${ equipment_responsible_f_name }','${ equipment_responsible_s_name }','${ equipment_responsible_l_name }','${ equipment_responsible_position }')`)
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
        const result = await db.oneOrNone(`INSERT INTO division(division_name) VALUES ('${division_name}');`)
        return res.status(200).json(result)
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
}

/* Обновление существующих данных */

module.exports.updateEquipment = async function (req, res) {
    try {
        const { 
            equipment_id,
            equipment_type_id, 
            equipment_status_id , 
            equipment_responsible_id, 
            equipment_name, 
            inventory_number } = req.body;
        const result = await db.oneOrNone(`update equipment
        set equipment_type_id = ${ equipment_type_id }, equipment_status_id = ${ equipment_status_id }, 
        equipment_responsible_id = ${ equipment_responsible_id }, equipment_name = '${ equipment_name }',
        inventory_number = '${ inventory_number }' where equipment_id = ${ equipment_id };`);
        return res.status(200).json(result)
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
}

module.exports.updateEquipmnetType = async function (req, res) {
    try {
        const { equipment_type_id, equipment_type_name } = req.body;
        const result = await db.oneOrNone(`update equipment_type set equipment_type_name = '${ equipment_type_name }' where equipment_type_id = ${ equipment_type_id };`)
        return res.status(200).json(result)
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
}

module.exports.updateEquipmnetStatus = async function (req, res) {
    try {
        const { equipment_status_id, equipment_status_name } = req.body;
        const result = await db.oneOrNone(`update equipment_status set equipment_status_name = '${ equipment_status_name }' where equipment_status_id = ${ equipment_status_id };`)
        return res.status(200).json(result)
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
}

module.exports.updateEquipmnetResponsible = async function (req, res) {
    try {
        const { 
            equipment_responsible_id,
            division_id,
            equipment_responsible_f_name,
            equipment_responsible_s_name,
            equipment_responsible_l_name,
            equipment_responsible_position,

        } = req.body
        const result = await db.oneOrNone(`update equipment_responsible 
        set division_id = ${ division_id }, equipment_responsible_f_name = '${ equipment_responsible_f_name }',
        equipment_responsible_s_name = '${ equipment_responsible_s_name }', equipment_responsible_l_name = '${ equipment_responsible_l_name }',
        equipment_responsible_position = '${ equipment_responsible_position }'
        where equipment_responsible_id = ${ equipment_responsible_id };`)
        return res.status(200).json(result)
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
}

module.exports.updateDivision = async function (req, res) {
    try {
        const { division_id, division_name } = req.body;
        const result = await db.oneOrNone(`update division set division_name = '${ division_name }' where division_id = ${ division_id };`)
        return res.status(200).json(result)
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
}