const { EntitySchema } = require("typeorm");

const PostEntity = new EntitySchema({
    name: "PostEntity",
    tableName: "posts",
    columns: {
        pos_id: {
            type: "int",
            primary: true,
            generated: true,
        },
        pos_titulo: {
            type: "varchar",
            length: 255,
        },
        pos_img_principal: {
            type: "text",
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
    relations: {
        documentos: {
            target: "DocumentEntity",
            type: "many-to-many",
            joinTable: {
                name: "posts_documentos",
                joinColumn: {
                    name: "pos_id",
                    referencedColumnName: "pos_id",
                },
                inverseJoinColumn: {
                    name: "doc_id",
                    referencedColumnName: "doc_id",
                },
            },
            cascade: true,
        },
        imagenes: {
            target: "GaleriaImagenesEntity",
            type: "many-to-many",
            joinTable: {
                name: "posts_imagenes",
                joinColumn: {
                    name: "pos_id",
                    referencedColumnName: "pos_id",
                },
                inverseJoinColumn: {
                    name: "gim_id",
                    referencedColumnName: "gim_id",
                },
            },
          cascade: true,
        },
    },
});

module.exports = {
    PostEntity
};
