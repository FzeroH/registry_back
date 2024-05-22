const pgp = require("pg-promise")();
const db = pgp(`postgres://postgres:QwasSawq1@127.0.0.1:5432/test_equipment`);

module.exports = { db }