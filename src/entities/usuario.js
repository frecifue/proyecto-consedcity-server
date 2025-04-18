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
            length: 50,
        },
        usu_primer_apellido: {
            type: "varchar",
            length: 50,
        },
        usu_segundo_apellido: {
            type: "varchar",
            length: 50,
        },
        usu_email: {
            type: "varchar",
            length: 50,
            unique: true,
        },
        usu_password: {
            type: "varchar",
            length: 255,
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
    relations: {
        tipo_usuario: {
        type: "many-to-one",
        target: "TipoUsuarioEntity",
        joinColumn: {
            name: "tus_id", // FK en la tabla usuarios
        },
        eager: true, // opcional: carga autom�tica la relaci�n
        },
    },
});

module.exports = {
    UsuarioEntity
};
