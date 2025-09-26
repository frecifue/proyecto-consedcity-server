module.exports = class FieldEnHome1755980409049 {
    name = 'FieldEnHome1755980409049'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`posts\` ADD \`pos_en_home\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`galeria_imagenes\` ADD \`gim_en_home\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`equipo\` ADD \`equ_en_home\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`documentos\` ADD \`doc_en_home\` tinyint NOT NULL DEFAULT 0`);
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
        await queryRunner.query(`ALTER TABLE \`proyectos_posts\` ADD CONSTRAINT \`FK_7d6deed213f9fb3f7a5b4f40610\` FOREIGN KEY (\`pro_id\`) REFERENCES \`proyecto\`(\`pro_id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`proyectos_posts\` ADD CONSTRAINT \`FK_a09e279aa857e2943e38026d94a\` FOREIGN KEY (\`pos_id\`) REFERENCES \`posts\`(\`pos_id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`proyectos_documentos\` ADD CONSTRAINT \`FK_556d691a0d6faa281b6fd6612c5\` FOREIGN KEY (\`pro_id\`) REFERENCES \`proyecto\`(\`pro_id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`proyectos_documentos\` ADD CONSTRAINT \`FK_689f7691e8dab9ff06ce558d53a\` FOREIGN KEY (\`doc_id\`) REFERENCES \`documentos\`(\`doc_id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`proyectos_imagenes\` ADD CONSTRAINT \`FK_810eb76c98140857cd179a0ec03\` FOREIGN KEY (\`pro_id\`) REFERENCES \`proyecto\`(\`pro_id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`proyectos_imagenes\` ADD CONSTRAINT \`FK_7befc5b888dc9f9b95786cacc64\` FOREIGN KEY (\`gim_id\`) REFERENCES \`galeria_imagenes\`(\`gim_id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`proyectos_equipos\` ADD CONSTRAINT \`FK_123e7b776bc103c632091a87313\` FOREIGN KEY (\`pro_id\`) REFERENCES \`proyecto\`(\`pro_id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`proyectos_equipos\` ADD CONSTRAINT \`FK_494aaae92a953c79095540272e5\` FOREIGN KEY (\`equ_id\`) REFERENCES \`equipo\`(\`equ_id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`proyectos_equipos\` DROP FOREIGN KEY \`FK_494aaae92a953c79095540272e5\``);
        await queryRunner.query(`ALTER TABLE \`proyectos_equipos\` DROP FOREIGN KEY \`FK_123e7b776bc103c632091a87313\``);
        await queryRunner.query(`ALTER TABLE \`proyectos_imagenes\` DROP FOREIGN KEY \`FK_7befc5b888dc9f9b95786cacc64\``);
        await queryRunner.query(`ALTER TABLE \`proyectos_imagenes\` DROP FOREIGN KEY \`FK_810eb76c98140857cd179a0ec03\``);
        await queryRunner.query(`ALTER TABLE \`proyectos_documentos\` DROP FOREIGN KEY \`FK_689f7691e8dab9ff06ce558d53a\``);
        await queryRunner.query(`ALTER TABLE \`proyectos_documentos\` DROP FOREIGN KEY \`FK_556d691a0d6faa281b6fd6612c5\``);
        await queryRunner.query(`ALTER TABLE \`proyectos_posts\` DROP FOREIGN KEY \`FK_a09e279aa857e2943e38026d94a\``);
        await queryRunner.query(`ALTER TABLE \`proyectos_posts\` DROP FOREIGN KEY \`FK_7d6deed213f9fb3f7a5b4f40610\``);
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
        await queryRunner.query(`ALTER TABLE \`documentos\` DROP COLUMN \`doc_en_home\``);
        await queryRunner.query(`ALTER TABLE \`equipo\` DROP COLUMN \`equ_en_home\``);
        await queryRunner.query(`ALTER TABLE \`galeria_imagenes\` DROP COLUMN \`gim_en_home\``);
        await queryRunner.query(`ALTER TABLE \`posts\` DROP COLUMN \`pos_en_home\``);
    }
}
