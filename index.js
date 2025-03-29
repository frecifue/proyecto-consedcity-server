require("reflect-metadata"); // Importar reflect-metadata

const { createConnection } = require("typeorm");
require("dotenv").config(); // Importar el archivo .env

const app = require("./app");
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, JWT_SECRET_KEY, IP_SERVER, API_VERSION } = process.env;

const PORT = process.env.PORT || 3977;

async function startServer() {
    try {
        // Conexión a MySQL usando TypeORM
        await createConnection({
            type: "mysql",
            host: DB_HOST, // Usamos DB_HOST de .env
            port: DB_PORT || 3306, // Usamos DB_PORT de .env (puerto 3306 por defecto)
            username: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME, // Usamos DB_NAME de .env
            entities: [
                __dirname + "/entities/**/*.js"  // Ajuste aquí para apuntar a las entidades
            ],
            synchronize: true,
            logging: true
        });
        console.log("? Conectado a MySQL");

        // Iniciar el servidor de la API
        app.listen(PORT, () => {
            console.log("\n###################");
            console.log("###### API REST ###");
            console.log("###################");
            console.log(`?? Servidor en: http://${IP_SERVER}:${PORT}/api/${API_VERSION}`);
        });

    } catch (error) {
        console.error("? Error de conexión:", error);
    }
}

startServer();
