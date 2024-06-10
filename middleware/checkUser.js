const { db } = require('../config/pg.config');

module.exports.checkAdmin = async function (req, res, next) {
    try {
        const { user_id, role_id } = req.headers
        const response = await db.oneOrNone(`select user_id, role_id from "user" where user_id = ${user_id}`);
        if (role_id == response.role_id) {
            if (response.role_id === 1){
                next()
            } else {
                res.status(403).json({ error: "У вас нет доступа к данной функции!" })
            }
        } else {
            res.status(403).json({ error: "У вас нет доступа к данной функции!" })
        }
    }
    catch (e) {
        console.log(e)
        res.status(401).json({ message: 'Для совершения действия необходимо авторизоваться' })
    }
}

module.exports.checkEmployee = async function (req, res, next) {
    try {
        const { user_id, role_id } = req.headers
        const response = await db.oneOrNone(`select user_id, role_id from "user" where user_id = ${user_id}`);
        if (role_id == response.role_id) {
            if (response.role_id === 1 || response.role_id === 2){
                next()
            }
            else {
                res.status(403).json({ error: "У вас нет доступа к данной функции!" })
            }
        } else {
            res.status(403).json({ error: "У вас нет доступа к данной функции!" })
        }
    } 
    catch (e) {
        console.log(e)
        res.status(401).json({ message: 'Для совершения действия необходимо авторизоваться' })
    }
}

module.exports.checkUser = async function (req, res, next) {
    try {
        const { user_id, role_id } = req.headers
        const response = await db.oneOrNone(`select user_id, role_id from "user" where user_id = ${user_id}`);
        if (role_id == response.role_id) {
            if (response.role_id === 1 || response.role_id === 2 || response.role_id === 3){
                next()
            }
            else {
                res.status(403).json({ error: "У вас нет доступа к данной функции!" })
            }
        } else {
            res.status(403).json({ error: "У вас нет доступа к данной функции!" })
        }
    } 
    catch (e) {
        console.log(e)
        res.status(401).json({ message: 'Для совершения действия необходимо авторизоваться' })
    }
}