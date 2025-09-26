module.exports = class NuevosCamposProyectoPost1756573110008 {
    name = 'NuevosCamposProyectoPost1756573110008'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`proyecto\` ADD \`pro_desc_corta\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proyecto\` ADD \`pro_orden\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proyecto\` ADD \`pro_path\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`proyecto\` ADD UNIQUE INDEX \`IDX_82a4831ab0b50d3c41a27c2e53\` (\`pro_path\`)`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` DROP FOREIGN KEY \`FK_46a8f5d868c8071387ddb5667a2\``);
        await queryRunner.query(`ALTER TABLE \`usuarios\` CHANGE \`usu_avatar\` \`usu_avatar\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` CHANGE \`usu_created_at\` \`usu_created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` CHANGE \`usu_updated_at\` \`usu_updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` CHANGE \`tus_id\` \`tus_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`tipo_usuario\` CHANGE \`tus_created_at\` \`tus_created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`tipo_usuario\` CHANGE \`tus_updated_at\` \`tus_updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`proyecto\` CHANGE \`pro_created_at\` \`pro_created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`proyecto\` CHANGE \`pro_updated_at\` \`pro_updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD UNIQUE INDEX \`IDX_1b560d6ab795c437ff55e4b079\` (\`pos_path\`)`);
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
        await queryRunner.query(`ALTER TABLE \`posts\` DROP INDEX \`IDX_1b560d6ab795c437ff55e4b079\``);
        await queryRunner.query(`ALTER TABLE \`proyecto\` CHANGE \`pro_updated_at\` \`pro_updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`proyecto\` CHANGE \`pro_created_at\` \`pro_created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`tipo_usuario\` CHANGE \`tus_updated_at\` \`tus_updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`tipo_usuario\` CHANGE \`tus_created_at\` \`tus_created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` CHANGE \`tus_id\` \`tus_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` CHANGE \`usu_updated_at\` \`usu_updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` CHANGE \`usu_created_at\` \`usu_created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` CHANGE \`usu_avatar\` \`usu_avatar\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` ADD CONSTRAINT \`FK_46a8f5d868c8071387ddb5667a2\` FOREIGN KEY (\`tus_id\`) REFERENCES \`tipo_usuario\`(\`tus_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`proyecto\` DROP INDEX \`IDX_82a4831ab0b50d3c41a27c2e53\``);
        await queryRunner.query(`ALTER TABLE \`proyecto\` DROP COLUMN \`pro_path\``);
        await queryRunner.query(`ALTER TABLE \`proyecto\` DROP COLUMN \`pro_orden\``);
        await queryRunner.query(`ALTER TABLE \`proyecto\` DROP COLUMN \`pro_desc_corta\``);
    }
}
