const { EntitySchema } = require("typeorm");

const InformacionGeneralEntity = new EntitySchema({
    name: "InformacionGeneralEntity", // El nombre de la entidad
    tableName: "informacion_general", // El nombre de la tabla en la base de datos
    columns: {
        ing_id: {
            type: "int",
            primary: true,
            generated: true, // Autoincremental
        },
        ing_quienes_somos: {
            type: "varchar",
            length: 500,
        },
        ing_mision: {
            type: "varchar",
            length: 500,
        },
        ing_vision: {
            type: "varchar",
            length: 500,
        },
        ing_nuestro_trabajo: {
            type: "varchar",
            length: 500,
        },
        ing_nuestro_trabajo_difusion: {
            type: "varchar",
            length: 500,
        },
        ing_nuestro_trabajo_formacion: {
            type: "varchar",
            length: 500,
        },
        ing_nuestro_trabajo_investigacion: {
            type: "varchar",
            length: 500,
        },
        ing_created_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
        ing_updated_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
        },
    },
});

module.exports = {
    InformacionGeneralEntity
};
