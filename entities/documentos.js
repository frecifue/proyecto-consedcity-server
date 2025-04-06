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
            type: "text", // mejor si puede ser más larga
        },
        doc_path: {
            type: "varchar",
            length: 500, // por si usas rutas largas o URLs
            unique: true, // ?? Esto asegura que no se repita
        },
        doc_documento: {
            type: "varchar",
            length: 500,
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
});

module.exports = {
    DocumentEntity,
};
