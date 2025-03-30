const { EntitySchema } = require("typeorm");

const GalleriaImagenesEntity = new EntitySchema({
    name: "GalleriaImagenesEntity", // El nombre de la entidad
    tableName: "galeria_imagenes", // El nombre de la tabla en la base de datos
    columns: {
        gim_id: {
            type: "int",
            primary: true,
            generated: true, // Autoincremental
        },
        gim_nombre: {
            type: "varchar",
            length: 255,
        },
        gim_imagen: {
            type: "text", 
        },
        gim_orden: {
            type: "int",
        },
        gim_created_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
        gim_updated_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
        },
    },
});

module.exports = {
    GalleriaImagenesEntity
};
