module.exports = class AnioProyecto1755983588142 {
    name = 'AnioProyecto1755983588142'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`proyecto\` ADD \`pro_anio\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` DROP FOREIGN KEY \`FK_46a8f5d868c8071387ddb5667a2\``);
        await queryRunner.query(`ALTER TABLE \`usuarios\` CHANGE \`usu_avatar\` \`usu_avatar\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` CHANGE \`usu_created_at\` \`usu_created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` CHANGE \`usu_updated_at\` \`usu_updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` CHANGE \`tus_id\` \`tus_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`tipo_usuario\` CHANGE \`tus_created_at\` \`tus_created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`tipo_usuario\` CHANGE \`tus_updated_at\` \`tus_updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`proyecto\` CHANGE \`pro_created_at\` \`pro_created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`proyecto\` CHANGE \`pro_updated_at\` \`pro_updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`pos_created_at\` \`pos_created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`pos_updated_at\` \`pos_updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`menu\` CHANGE \`men_created_at\` \`men_created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`menu\` CHANGE \`men_updated_at\` \`men_updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`informacion_general\` CHANGE \`ing_created_at\` \`ing_created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`informacion_general\` CHANGE \`ing_updated_at\` \`ing_updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`galeria_imagenes\` CHANGE \`gim_created_at\` \`gim_created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`galeria_imagenes\` CHANGE \`gim_updated_at\` \`gim_updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`equipo\` CHANGE \`equ_created_at\` \`equ_created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`equipo\` CHANGE \`equ_updated_at\` \`equ_updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`documentos\` CHANGE \`doc_created_at\` \`doc_created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`documentos\` CHANGE \`doc_updated_at\` \`doc_updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` ADD CONSTRAINT \`FK_46a8f5d868c8071387ddb5667a2\` FOREIGN KEY (\`tus_id\`) REFERENCES \`tipo_usuario\`(\`tus_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`usuarios\` DROP FOREIGN KEY \`FK_46a8f5d868c8071387ddb5667a2\``);
        await queryRunner.query(`ALTER TABLE \`documentos\` CHANGE \`doc_updated_at\` \`doc_updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`documentos\` CHANGE \`doc_created_at\` \`doc_created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`equipo\` CHANGE \`equ_updated_at\` \`equ_updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`equipo\` CHANGE \`equ_created_at\` \`equ_created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`galeria_imagenes\` CHANGE \`gim_updated_at\` \`gim_updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`galeria_imagenes\` CHANGE \`gim_created_at\` \`gim_created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`informacion_general\` CHANGE \`ing_updated_at\` \`ing_updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`informacion_general\` CHANGE \`ing_created_at\` \`ing_created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`menu\` CHANGE \`men_updated_at\` \`men_updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`menu\` CHANGE \`men_created_at\` \`men_created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`pos_updated_at\` \`pos_updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`pos_created_at\` \`pos_created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`proyecto\` CHANGE \`pro_updated_at\` \`pro_updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`proyecto\` CHANGE \`pro_created_at\` \`pro_created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`tipo_usuario\` CHANGE \`tus_updated_at\` \`tus_updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`tipo_usuario\` CHANGE \`tus_created_at\` \`tus_created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` CHANGE \`tus_id\` \`tus_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` CHANGE \`usu_updated_at\` \`usu_updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` CHANGE \`usu_created_at\` \`usu_created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` CHANGE \`usu_avatar\` \`usu_avatar\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` ADD CONSTRAINT \`FK_46a8f5d868c8071387ddb5667a2\` FOREIGN KEY (\`tus_id\`) REFERENCES \`tipo_usuario\`(\`tus_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`proyecto\` DROP COLUMN \`pro_anio\``);
    }
}
