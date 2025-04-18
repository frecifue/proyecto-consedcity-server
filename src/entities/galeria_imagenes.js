const { EntitySchema } = require("typeorm");

const GaleriaImagenesEntity = new EntitySchema({
    name: "GaleriaImagenesEntity", // El nombre de la entidad
    tableName: "galeria_imagenes", // El nombre de la tabla en la base de datos
    columns: {
        gim_id: {
            type: "int",
            primary: true,
            generated: true, // Autoincremental
        },
        gim_nombre: {
            type: "varchar",
            length: 100,
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
    relations: {
        posts: {
            target: "PostEntity",
            type: "many-to-many",
            joinTable:{
                name: "posts_imagenes",
                joinColumn: {
                    name: "gim_id",
                    referencedColumnName: "gim_id",
                },
                inverseJoinColumn: {
                    name: "pos_id",
                    referencedColumnName: "pos_id",
                },
            },
            cascade: true,
        },
    },
});

module.exports = {
    GaleriaImagenesEntity
};



