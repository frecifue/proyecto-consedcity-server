// src/migrations/CrearTablaProyecto1755972029364.js
module.exports = class CrearTablaProyecto1755972029364 {
  name = 'CrearTablaProyecto1755972029364'

  async up(queryRunner) {
    await queryRunner.query(`CREATE TABLE \`proyecto\` (
      \`pro_id\` int NOT NULL AUTO_INCREMENT,
      \`pro_nombre\` varchar(255) NOT NULL,
      \`pro_descripcion\` text NOT NULL,
      \`pro_created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`pro_updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (\`pro_id\`)
    ) ENGINE=InnoDB`);
    
    await queryRunner.query(`CREATE TABLE \`proyectos_posts\` (
      \`pro_id\` int NOT NULL,
      \`pos_id\` int NOT NULL,
      INDEX \`IDX_7d6deed213f9fb3f7a5b4f4061\` (\`pro_id\`),
      INDEX \`IDX_a09e279aa857e2943e38026d94\` (\`pos_id\`),
      PRIMARY KEY (\`pro_id\`, \`pos_id\`)
    ) ENGINE=InnoDB`);

    await queryRunner.query(`CREATE TABLE \`proyectos_documentos\` (
      \`pro_id\` int NOT NULL,
      \`doc_id\` int NOT NULL,
      INDEX \`IDX_556d691a0d6faa281b6fd6612c\` (\`pro_id\`),
      INDEX \`IDX_689f7691e8dab9ff06ce558d53\` (\`doc_id\`),
      PRIMARY KEY (\`pro_id\`, \`doc_id\`)
    ) ENGINE=InnoDB`);

    await queryRunner.query(`CREATE TABLE \`proyectos_imagenes\` (
      \`pro_id\` int NOT NULL,
      \`gim_id\` int NOT NULL,
      INDEX \`IDX_810eb76c98140857cd179a0ec0\` (\`pro_id\`),
      INDEX \`IDX_7befc5b888dc9f9b95786cacc6\` (\`gim_id\`),
      PRIMARY KEY (\`pro_id\`, \`gim_id\`)
    ) ENGINE=InnoDB`);

    await queryRunner.query(`CREATE TABLE \`proyectos_equipos\` (
      \`pro_id\` int NOT NULL,
      \`equ_id\` int NOT NULL,
      INDEX \`IDX_123e7b776bc103c632091a8731\` (\`pro_id\`),
      INDEX \`IDX_494aaae92a953c79095540272e\` (\`equ_id\`),
      PRIMARY KEY (\`pro_id\`, \`equ_id\`)
    ) ENGINE=InnoDB`);

    // Puedes agregar aquí los ALTER TABLE si necesitas mantener compatibilidad con otros cambios
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE \`proyectos_equipos\``);
    await queryRunner.query(`DROP TABLE \`proyectos_imagenes\``);
    await queryRunner.query(`DROP TABLE \`proyectos_documentos\``);
    await queryRunner.query(`DROP TABLE \`proyectos_posts\``);
    await queryRunner.query(`DROP TABLE \`proyecto\``);
  }
};
