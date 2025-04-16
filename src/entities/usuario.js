const { EntitySchema } = require("typeorm");

  const UsuarioEntity = new EntitySchema({
    name: "UsuarioEntity", // El nombre de la entidad
    tableName: "usuarios", // El nombre de la tabla en la base de datos
    columns: {
        usu_id: {
            type: "int",
            primary: true,
            generated: true, // Autoincremental
        },
        usu_nombres: {
            type: "varchar",
            length: 255,
        },
        usu_primer_apellido: {
            type: "varchar",
            length: 255,
        },
        usu_segundo_apellido: {
            type: "varchar",
            length: 255,
        },
        usu_email: {
            type: "varchar",
            length: 255,
            unique: true,
        },
        usu_password: {
            type: "varchar",
            length: 255,
        },
        usu_rol: {
            type: "enum",
            enum: ["admin", "colaborador"],
            default: "colaborador",
        },
        usu_activo: {
            type: "boolean",
            default: false,
        },
        usu_avatar: {
            type: "text", 
            nullable: true, 
        },
        usu_created_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
        usu_updated_at: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
        },
    },
});

module.exports = {
    UsuarioEntity
};
