const pgp = require("pg-promise")();

const db = pgp(`postgres://postgres:QwasSawq1@45.140.19.41:5432/equipments`);

module.exports = { db }