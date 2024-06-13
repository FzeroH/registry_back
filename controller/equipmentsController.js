const { db } = require('../config/pg.config');

/* Получение данных из БД */
module.exports.getEquipmentsList = async function (req, res) {
    try {
        const { order, sort, search } = req.query;
        const search_query = search ? `where (equipment_status_name || '~' || us.login || '~' || equipment_name || '~' || inventory_number || '~' || resp.middle_name 
	|| '~' || resp.first_name || '~' || resp.last_name || '~' || division_name || '~' || date_start || '~' || date_update || '~' || balance_cost 
	|| '~' || quantity || '~' || date_registration) ILIKE '%' || '${search}' || '%' ` : '';
        const result = await db.manyOrNone(`select equipment_id, equipment_status_name, us.login, 
	equipment_name, inventory_number,
	resp.last_name || ' ' || resp.first_name || ' ' || resp.middle_name as responsible_full_name,
	division_name, resp.division_id, responsible_id, equipment.equipment_status_id,
	date_start, date_update, balance_cost, quantity,
	date_registration, date_de_registration from equipment
	join "user" as us on equipment.user_id = us.user_id
	join "user" as resp on equipment.responsible_id = resp.user_id
	join division on resp.division_id = division.division_id
	join equipment_status on equipment.equipment_status_id = equipment_status.equipment_status_id ${search_query}
    order by ${order} ${sort};`);

        const formatted_result = result.map((el) => {
            const date_start = new Date(el.date_start);
            const date_start_string = `${date_start.getFullYear()}-${String(date_start.getMonth()+1).padStart(2,'0')}-${String(date_start.getDate()).padStart(2,'0')}`;

            const date_update = new Date(el.date_update);
            const date_update_string = `${date_update.getFullYear()}-${String(date_update.getMonth()+1).padStart(2,'0')}-${String(date_update.getDate()).padStart(2,'0')}`;

            const date_registration = new Date(el.date_registration);
            const date_registration_string = `${date_registration.getFullYear()}-${String(date_registration.getMonth()+1).padStart(2,'0')}-${String(date_registration.getDate()).padStart(2,'0')}`;

            const date_de_registration = el.date_de_registration? new Date(el.date_de_registration) : '';
            const date_de_registration_string = el.date_de_registration? `${date_de_registration.getFullYear()}-${String(date_de_registration.getMonth()+1).padStart(2,'0')}-${String(date_de_registration.getDate()).padStart(2,'0')}`: '';
            return { ...el, date_start: date_start_string, date_update: date_update_string, date_registration: date_registration_string, date_de_registration: date_de_registration_string  }
        })
        return res.status(200).json(formatted_result)
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
}

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
        const result = await db.manyOrNone(`select user_id as responsible_id,
        last_name || ' ' || first_name || ' ' || middle_name as equipment_responsible_full_name, 
        "user".division_id, division_name
        from "user" join division on "user".division_id = division.division_id where role_id = 3 order by user_id asc;`)
        return res.status(200).json(result)
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
}

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

module.exports.getRoleList = async function (req, res) {
    try {
        const result = await db.manyOrNone(`select * from role order by role_id asc;`)
        return res.status(200).json(result)
    }
    catch(e) {
        console.error(e);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
}

module.exports.getUserList = async function (req, res) {
    try {
        const result = await db.manyOrNone(`select user_id, us.role_id, role_name, us.division_id, division_name, 
	login, first_name, last_name, middle_name 
	from "user" as us
	join role on us.role_id = role.role_id
	join division on us.division_id = division.division_id
	order by user_id asc;`)
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
        const { equipment_status_id, user_id, responsible_id, equipment_name, inventory_number, balance_cost, quantity, date_registration, date_de_registration } = req.body;
        const result = await db.oneOrNone(`insert into equipment(equipment_status_id, user_id, responsible_id, equipment_name,
            inventory_number, balance_cost, quantity, date_registration, date_de_registration)
    values ($1, $2, $3, $4, $5, $6, $7, $8, $9);`, [equipment_status_id, user_id, responsible_id, equipment_name, inventory_number, balance_cost, quantity, date_registration,date_de_registration])
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

/* Обновление существующих данных */

module.exports.updateEquipment = async function (req, res) {
    try {
        const date = new Date();
        const dateString = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
        const { 
            equipment_id,
            equipment_status_id , 
            responsible_id, 
            equipment_name, 
            inventory_number,
            balance_cost,
            quantity, 
            date_registration, 
            date_de_registration
        } = req.body;
        console.log(req.body)
        const result = await db.oneOrNone(`update equipment set equipment_status_id = $2, responsible_id = $3, equipment_name = $4,
	inventory_number = $5, date_update =  '${dateString}', balance_cost = $6, quantity = $7, date_registration =$8,
	date_de_registration = $9 where equipment_id = $1;`, [equipment_id, equipment_status_id , responsible_id, equipment_name, inventory_number, balance_cost, quantity, date_registration, date_de_registration]);
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

/* Генерация документа */
module.exports.generateDocument = async function (req, res) {
    try {
        const fs = require('fs');
        const Docxtemplater = require('docxtemplater');
        const PizZip = require('pizzip');
        const path = require('path');
        const { search } = req.query

        const search_query = search ? `where (equipment_status_name || '~' || us.login || '~' || equipment_name || '~' || inventory_number || '~' || resp.middle_name 
        || '~' || resp.first_name || '~' || resp.last_name || '~' || division_name || '~' || date_start || '~' || date_update || '~' || balance_cost 
        || '~' || quantity || '~' || date_registration) ILIKE '%' || '${search}' || '%' ` : '';

        const result = await db.manyOrNone(`select equipment_status_name, us.login, 
        equipment_name, inventory_number,
        resp.last_name || ' ' || resp.first_name || ' ' || resp.middle_name as responsible_full_name,
        division_name,
        date_start, date_update, balance_cost, quantity,
        date_registration, date_de_registration from equipment
        join "user" as us on equipment.user_id = us.user_id
        join "user" as resp on equipment.responsible_id = resp.user_id
        join division on resp.division_id = division.division_id
        join equipment_status on equipment.equipment_status_id = equipment_status.equipment_status_id ${search_query}
        order by equipment_id asc;`);

        const data = result.map((el) => {
            const date_start = new Date(el.date_start);
            const date_start_string = `${date_start.getFullYear()}-${String(date_start.getMonth()+1).padStart(2,'0')}-${String(date_start.getDate()).padStart(2,'0')}`;

            const date_update = new Date(el.date_update);
            const date_update_string = `${date_update.getFullYear()}-${String(date_update.getMonth()+1).padStart(2,'0')}-${String(date_update.getDate()).padStart(2,'0')}`;

            const date_registration = new Date(el.date_registration);
            const date_registration_string = `${date_registration.getFullYear()}-${String(date_registration.getMonth()+1).padStart(2,'0')}-${String(date_registration.getDate()).padStart(2,'0')}`;

            const date_de_registration = el.date_de_registration? new Date(el.date_de_registration) : '';
            const date_de_registration_string = el.date_de_registration? `${date_de_registration.getFullYear()}-${String(date_de_registration.getMonth()+1).padStart(2,'0')}-${String(date_de_registration.getDate()).padStart(2,'0')}`: '';

            const balance = `${el.balance_cost} руб.`
            return { ...el, date_start: date_start_string, date_update: date_update_string, date_registration: date_registration_string, date_de_registration: date_de_registration_string, balance_cost: balance  }
        })

        const abs = path.resolve(__dirname,'../docs_template/template.docx')
        const content = fs.readFileSync(abs, 'binary');
        const zip = new PizZip(content);

        const doc = new Docxtemplater(zip);

        const date = new Date();
        const string_date = `${String(date.getDate()).padStart(2,'0')}.${String(date.getMonth()+1).padStart(2,'0')}.${date.getFullYear()}`
        doc.render({
            data,
            string_date
        });

        const generatedDocument = doc.getZip().generate({ type: 'nodebuffer' });
        const filename = `Выгрузка данных ${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`

        await fs.writeFileSync(`${__dirname}/../public/${filename}.docx`, generatedDocument);
        res.on('finish', () => {
            fs.unlink(`${__dirname}/../public/${filename}.docx`, (err) => {
                if (err) {
                    console.error('Ошибка при удалении файла:', err);
                    return;
                }
                console.log('Файл успешно удален');
            });
        });
        await res.download(`${__dirname}/../public/${filename}.docx`, (err) => {
            if (err) {
                res.status(500).send(`При загрузке файла произошла ошибка:\n${err}`)
                console.log(err)
            }
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: `Произошла ошибка ${e}`
        })
    }

}