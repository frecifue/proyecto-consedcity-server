const { EntitySchema } = require("typeorm");

const DocumentEntity = new EntitySchema({
    name: "DocumentEntity",
    tableName: "documentos",
    columns: {
        doc_id: {
            type: "int",
            primary: true,
            generated: true,
        },
        doc_titulo: {
            type: "varchar",
            length: 255,
        },
        doc_descripcion: {
            type: "varchar",
            length: 255,
        },
        doc_documento: {
            type: "text",
        },
        doc_orden: {
            type: "int",
        },
        doc_created_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
        doc_updated_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
        },
    },
    relations: {
        posts: {
            target: "PostEntity",
            type: "many-to-many",
            joinTable: {
                name: "posts_documentos",
                joinColumn: {
                    name: "doc_id",
                    referencedColumnName: "doc_id",
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
    DocumentEntity,
};
