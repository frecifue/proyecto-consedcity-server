const { EntitySchema } = require("typeorm");

const MenuEntity = new EntitySchema({
    name: "MenuEntity", // El nombre de la entidad
    tableName: "menu", // El nombre de la tabla en la base de datos
    columns: {
        men_id: {
            type: "int",
            primary: true,
            generated: true, // Autoincremental
        },
        men_titulo: {
            type: "varchar",
            length: 50,
        },
        men_path: {
            type: "varchar",
            length: 255,
        },
        men_orden: {
            type: "int",
        },
        men_activo: {
            type: "boolean",
            default: false,
        },
        men_created_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
        men_updated_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
        },
    },
});

module.exports = {
    MenuEntity
};
