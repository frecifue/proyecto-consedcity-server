const { DocumentEntity } = require('../../src/entities/documentos');
const {AppDataSource} = require('../../src/data-source');
const { randomInt } = require('crypto');


async function seedDocumentEntity() {
    const repository = AppDataSource.getRepository(DocumentEntity);

    const data = [
        {
          doc_titulo: 'Introduction to Programming',
          doc_descripcion: 'A beginner\'s guide to programming concepts.',
          doc_path: `/documents/intro-to-programming${randomInt(1000)}.pdf`,
          doc_documento: 'intro-to-programming.pdf',
          doc_orden: 1,
        },
        {
          doc_titulo: 'Advanced JavaScript',
          doc_descripcion: 'Deep dive into JavaScript and its advanced features.',
          doc_path: `/documents/intro-to-programming${randomInt(1000)}.pdf`,
          doc_documento: 'advanced-javascript.pdf',
          doc_orden: 2,
        },
        {
          doc_titulo: 'Database Design',
          doc_descripcion: 'Principles and practices for designing databases.',
          doc_path: `/documents/intro-to-programming${randomInt(1000)}.pdf`,
          doc_documento: 'database-design.pdf',
          doc_orden: 3,
        },
        // Add more documents as needed
      ];
  for (const value of data) {
    const dataEntity = repository.create(value);
    await repository.save(dataEntity);
  }

  console.log('DocumentEntity seeding completed.');
}

module.exports = {
  seedDocumentEntity,
};
