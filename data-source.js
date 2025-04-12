// data-source.js
const { DataSource } = require("typeorm");
require("dotenv").config();

const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: [__dirname + "/entities/**/*.js"],
});

module.exports = {
    AppDataSource,
};
