module.exports = class NuevoCampoVideojuegos1761407890785 {
    name = 'NuevoCampoVideojuegos1761407890785'

    async up(queryRunner) {
        // Solo modificar longitudes existentes sin borrar datos
        await queryRunner.query(`ALTER TABLE \`informacion_general\` MODIFY \`ing_quienes_somos\` varchar(2000) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`informacion_general\` MODIFY \`ing_mision\` varchar(1000) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`informacion_general\` MODIFY \`ing_vision\` varchar(1000) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`informacion_general\` MODIFY \`ing_nuestro_trabajo\` varchar(1000) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`informacion_general\` MODIFY \`ing_nuestro_trabajo_difusion\` varchar(1000) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`informacion_general\` MODIFY \`ing_nuestro_trabajo_formacion\` varchar(1000) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`informacion_general\` MODIFY \`ing_nuestro_trabajo_investigacion\` varchar(1000) NOT NULL`);

        // Agregar nuevo campo sin afectar los existentes
        await queryRunner.query(`ALTER TABLE \`informacion_general\` ADD \`ing_nuestro_trabajo_creacion_videojuegos\` varchar(1000) NOT NULL`);

        // Mantener timestamps
        await queryRunner.query(`ALTER TABLE \`informacion_general\` CHANGE \`ing_created_at\` \`ing_created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`informacion_general\` CHANGE \`ing_updated_at\` \`ing_updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
    }

    async down(queryRunner) {
        // Revertir longitudes a los valores anteriores
        await queryRunner.query(`ALTER TABLE \`informacion_general\` MODIFY \`ing_quienes_somos\` varchar(500) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`informacion_general\` MODIFY \`ing_mision\` varchar(500) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`informacion_general\` MODIFY \`ing_vision\` varchar(500) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`informacion_general\` MODIFY \`ing_nuestro_trabajo\` varchar(500) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`informacion_general\` MODIFY \`ing_nuestro_trabajo_difusion\` varchar(500) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`informacion_general\` MODIFY \`ing_nuestro_trabajo_formacion\` varchar(500) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`informacion_general\` MODIFY \`ing_nuestro_trabajo_investigacion\` varchar(500) NOT NULL`);

        // Borrar el campo nuevo
        await queryRunner.query(`ALTER TABLE \`informacion_general\` DROP COLUMN \`ing_nuestro_trabajo_creacion_videojuegos\``);

        // Mantener timestamps
        await queryRunner.query(`ALTER TABLE \`informacion_general\` CHANGE \`ing_created_at\` \`ing_created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`informacion_general\` CHANGE \`ing_updated_at\` \`ing_updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
    }
}
