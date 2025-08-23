const { EntitySchema } = require("typeorm");

const ProjectEntity = new EntitySchema({
    name: "ProjectEntity",
    tableName: "proyecto",
    columns: {
        pro_id: {
            type: "int",
            primary: true,
            generated: true,
        },
        pro_nombre: {
            type: "varchar",
            length: 255,
        },
        pro_descripcion: {
            type: "text",
        },    
        pro_created_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
        pro_updated_at: {
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
                name: "proyectos_posts",
                joinColumn: {
                    name: "pro_id",
                    referencedColumnName: "pro_id",
                },
                inverseJoinColumn: {
                    name: "pos_id",
                    referencedColumnName: "pos_id",
                },
            },
            cascade: true,
        },
        documentos: {
            target: "DocumentEntity",
            type: "many-to-many",
            joinTable: {
                name: "proyectos_documentos",
                joinColumn: {
                    name: "pro_id",
                    referencedColumnName: "pro_id",
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
                name: "proyectos_imagenes",
                joinColumn: {
                    name: "pro_id",
                    referencedColumnName: "pro_id",
                },
                inverseJoinColumn: {
                    name: "gim_id",
                    referencedColumnName: "gim_id",
                },
            },
          cascade: true,
        },
        equipos: {
            target: "EquipoEntity",
            type: "many-to-many",
            joinTable: {
                name: "proyectos_equipos",
                joinColumn: {
                    name: "pro_id",
                    referencedColumnName: "pro_id",
                },
                inverseJoinColumn: {
                    name: "equ_id",
                    referencedColumnName: "equ_id",
                },
            },
          cascade: true,
        },
    },
});

module.exports = {
    ProjectEntity
};
