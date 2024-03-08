const Pool = require('pg').Pool;
require('dotenv').config();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

// console.log(username, password);

const pool = new Pool({
    user: username,
    password: password,
    host: "localhost",
    port: 5432,
    database: "buymeonline"
});

module.exports = pool;