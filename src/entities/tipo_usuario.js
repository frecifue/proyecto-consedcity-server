const { EntitySchema } = require("typeorm");

const TipoUsuarioEntity = new EntitySchema({
    name: "TipoUsuarioEntity", // El nombre de la entidad
    tableName: "tipo_usuario", // El nombre de la tabla en la base de datos
    columns: {
        tus_id: {
            type: "int",
            primary: true,
            generated: true, // Autoincremental
        },
        tus_nombre: {
            type: "varchar",
            length: 100,
        },
        tus_descripcion: {
            type: "varchar",
            length: 255,
        },  
        tus_created_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
        tus_updated_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
        },
    },
});

module.exports = {
    TipoUsuarioEntity
};