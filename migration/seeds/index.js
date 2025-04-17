const { seedDocumentEntity } = require('./Documento');
const { seedPostEntity } = require('./Post');
const { seedGalleryEntity } = require('./Galeria');
const { AppDataSource } = require('../../src/data-source');

async function runSeeder() {
  try {
    console.log('Init Seeder...');
    await AppDataSource.initialize();
    console.log('DataSource initialized.');

    await seedPostEntity();
    await seedDocumentEntity();
    await seedGalleryEntity();
    
    console.log('Seeding completed.');

  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await AppDataSource.destroy();
    console.log('DataSource destroyed.');
  }
}

runSeeder();
