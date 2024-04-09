const { db } = require('../config/pg.config');

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

