const { db } = require('../config/pg.config');

/* Авторизация и регистрация */
module.exports.registration = async function (req, res) {
    try {
        const {  role_id, division_id, login, password, first_name, last_name, middle_name } = req.body;
        if (await db.oneOrNone(`select user_id from "user" where login = '${login}'`)) {
            res.status(409).json({ error: 'Пользователь существует' });
        } 
        else {
            await db.oneOrNone(`insert into "user" (role_id, division_id, login, password, first_name, last_name, middle_name) values ('${role_id}','${division_id}','${login}', '${password}', '${first_name}', '${last_name}', '${middle_name}');`)
            return res.status(200).json({message:"Пользователь успешно создан!"})
        }
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
}

module.exports.login = async function (req, res) {
    try {
        const { login, password } = req.body;
        const result = await db.one(`select user_id, role_id from "user" where login = '${login}' and password = '${password}'`)
        return res.status(200).json(result)
    }
    catch(e) {
        console.error(e);
        res.status(401).json({ error: 'Неправильный логин или пароль' });
    }
}

/* Получение данных из БД */
module.exports.getEquipmentsList = async function (req, res) {
    try {
        const { order, sort } = req.query
        const result = await db.manyOrNone(`select equipment_id, equipment_type_name, 
        equipment_status_name, 
        equipment_responsible_l_name || ' ' || equipment_responsible_f_name || ' ' || equipment_responsible_s_name as equipment_responsible_full_name,
        equipment.equipment_responsible_id, equipment.equipment_status_id, 
        equipment.equipment_type_id, equipment.user_id,
        equipment_name, inventory_number, equipment_responsible.division_id,
        division_name, equipment_responsible_position, date_start, date_update, login
        from equipment
        join equipment_type 
        on equipment.equipment_type_id = equipment_type.equipment_type_id
        join equipment_status on equipment.equipment_status_id = equipment_status.equipment_status_id
        join equipment_responsible on equipment.equipment_responsible_id = equipment_responsible.equipment_responsible_id
        join division on equipment_responsible.division_id = division.division_id
        join "user" as us on equipment.user_id = us.user_id
        order by ${order} ${sort};`)

        const formatted_result = result.map((el) => {
            const date_start = new Date(el.date_start);
            const date_start_string = `${date_start.getFullYear()}-${String(date_start.getMonth()+1).padStart(2,'0')}-${String(date_start.getDate()).padStart(2,'0')}`;

            const date_update = new Date(el.date_update);
            const date_update_string = `${date_update.getFullYear()}-${String(date_update.getMonth()+1).padStart(2,'0')}-${String(date_update.getDate()).padStart(2,'0')}`;
            return { ...el, date_start: date_start_string, date_update: date_update_string }
        })
        return res.status(200).json(formatted_result)
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
} //переписать. изменилась структура таблицы

module.exports.getEquipmnetStatusList = async function (req, res) {
    try {
        const result = await db.manyOrNone(`select * from equipment_status order by equipment_status_id asc;`)
        return res.status(200).json(result)
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
}

module.exports.getEquipmnetResponsibleList = async function (req, res) {
    try {
        const result = await db.manyOrNone(`select user_id,
        middle_name || ' ' || first_name || ' ' || last_name 
        as equipment_responsible_full_name, "user".division_id, division_name
        from "user" join division on "user".division_id = division.division_id where role_id = 3 order by user_id asc;`)
        return res.status(200).json(result)
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
} // изменить функцию. ответственные стали пользователями с ролью с id 3. 

module.exports.getDivisionList = async function (req, res) {
    try {
        const result = await db.manyOrNone(`select * from division order by division_id asc;`)
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
        const { equipment_type_id, equipment_status_id, equipment_responsible_id, equipment_name, inventory_number, user_id } = req.body;
        const result = await db.oneOrNone(`insert into equipment(equipment_type_id, 
            equipment_status_id, equipment_responsible_id, user_id, equipment_name, inventory_number) values
            (${ equipment_type_id }, ${ equipment_status_id }, ${ equipment_responsible_id }, ${user_id}, '${ equipment_name }', '${ inventory_number }');`)
        return res.status(200).json(result)
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
} //переписать. изменилась структура таблицы

module.exports.addEquipmnetStatus = async function (req, res) {
    try {
        const { equipment_status_name } = req.body;
        const result = await db.oneOrNone(`insert into equipment_status(equipment_status_name) values ('${ equipment_status_name }');`)
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
        const date = new Date();
        const dateString = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
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
        inventory_number = '${ inventory_number }', date_update = '${dateString}' where equipment_id = ${ equipment_id };`);
        return res.status(200).json(result)
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
} //переписать. изменилась структура таблицы

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

module.exports.updateUser = async function (req, res) {
    try {
        const { user_id, role_id, division_id, login, password, first_name, last_name, middle_name } = req.body;
        const result = await db.oneOrNone(`update "user" set role_id = '${role_id}', division_id = '${ division_id }', login = '${login}', password = '${password}', first_name = '${first_name}', last_name = '${last_name}', middle_name = '${middle_name}' where user_id = ${ user_id };`)
        return res.status(200).json(result)
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
}