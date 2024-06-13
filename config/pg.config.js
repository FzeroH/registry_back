const pgp = require("pg-promise")();

const db = pgp(`postgres://postgres:Ptvyfz-Ndthlm.@45.140.19.41:5432/equipments`);

module.exports = { db }