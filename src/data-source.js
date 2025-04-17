// data-source.js
const { DataSource } = require("typeorm");
require("dotenv").config();
const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    logging: true,
    entities: ["./src/entities/**/*.js"],
    synchronize: process.env.NODE_ENV !== 'production',
    debug: false,
    seeds: ['./migration/seeds/**/*{.ts,.js}'],
    seedTracking: false,
});

module.exports = {
    AppDataSource,
};
