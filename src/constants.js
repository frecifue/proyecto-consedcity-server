require('dotenv').config(); // Cargar variables de entorno

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_HOST_PROD = process.env.DB_HOST_PROD;
const USE_ATLAS = process.env.USE_ATLAS === 'true'; // Convertir string a booleano

const API_VERSION = 'v1';
const IP_SERVER = 'localhost';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

module.exports = {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_HOST_PROD,
    USE_ATLAS,
    API_VERSION,
    IP_SERVER,
    JWT_SECRET_KEY
};
