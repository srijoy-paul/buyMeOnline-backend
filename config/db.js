const { Sequelize } = require("sequelize");
require('dotenv').config();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

const createDB = new Sequelize("buymeonline-DB", username, password, {
    dialect: "sqlite",
    host: "./config/db.sqlite",
});

module.exports = createDB;