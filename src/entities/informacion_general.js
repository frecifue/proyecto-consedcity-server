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
            type: "text",
        },
        ing_mision: {
            type: "text",
        },
        ing_vision: {
            type: "text",
        },
        ing_nuestro_trabajo: {
            type: "text",
        },
        ing_nuestro_trabajo_difusion: {
            type: "text",
        },
        ing_nuestro_trabajo_formacion: {
            type: "text",
        },
        ing_nuestro_trabajo_investigacion: {
            type: "text",
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
