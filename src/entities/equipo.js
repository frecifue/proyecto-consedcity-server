const { EntitySchema } = require("typeorm");

const EquipoEntity = new EntitySchema({
    name: "EquipoEntity", // El nombre de la entidad
    tableName: "equipo", // El nombre de la tabla en la base de datos
    columns: {
        equ_id: {
            type: "int",
            primary: true,
            generated: true, // Autoincremental
        },
        equ_nombre: {
            type: "varchar",
            length: 100,
        },
        equ_foto_perfil: {
            type: "varchar",
            length: 255,
        },
        equ_descripcion: {
            type: "varchar",
            length: 255,
        },
        equ_orden: {
            type: "int",
        },
        equ_created_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
        equ_updated_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
        },
    },
});

module.exports = {
    EquipoEntity
};
