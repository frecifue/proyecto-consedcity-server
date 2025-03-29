const { EntitySchema } = require("typeorm");

const PostEntity = new EntitySchema({
    name: "PostEntity", // El nombre de la entidad
    tableName: "posts", // El nombre de la tabla en la base de datos
    columns: {
        pos_id: {
            type: "int",
            primary: true,
            generated: true, // Autoincremental
        },
        pos_titulo: {
            type: "varchar",
            length: 255,
        },
        pos_img_principal: {
            type: "varchar",
            length: 255,
        },
        pos_contenido: {
            type: "text",
        },
        pos_path: {
            type: "varchar",
            length: 255,
        },
        pos_created_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
        pos_updated_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
        },
    },
});

module.exports = {
    PostEntity
};
