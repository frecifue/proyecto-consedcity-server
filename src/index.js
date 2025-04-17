require("reflect-metadata"); // Importar reflect-metadata
require("dotenv").config(); // Cargar variables de entorno

const app = require("./app");
const { AppDataSource } = require("./data-source"); // Importamos el DataSource
const { IP_SERVER, API_VERSION } = process.env;

const PORT = process.env.PORT || 3977;

async function startServer() {
    try {
        // Iniciar la conexion a la base de datos
        await AppDataSource.initialize();
        console.log("? Conectado a MySQL con TypeORM");

        // Iniciar el servidor de la API
        app.listen(PORT, () => {
            console.log("\n###################");
            console.log("###### API REST ###");
            console.log("###################");
            console.log(`?? Servidor en: http://${IP_SERVER}:${PORT}/api/${API_VERSION}`);
        });

    } catch (error) {
        console.error("? Error de conexi�n a la base de datos:", error);
    }
}

startServer();
