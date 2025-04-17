const { GaleriaImagenesEntity } = require('../../src/entities/galeria_imagenes');
const {AppDataSource} = require('../../src/data-source');


async function seedGalleryEntity() {
    const repository = AppDataSource.getRepository(GaleriaImagenesEntity);

    const data = [
      {
          gim_nombre: "Imagen 1",
          gim_imagen: "imagen1.jpg",
          gim_orden: 1,
      },
      {
          gim_nombre: "Imagen 2",
          gim_imagen: "imagen2.jpg",
          gim_orden: 2,
      },
      {
          gim_nombre: "Imagen 3",
          gim_imagen: "imagen3.jpg",
          gim_orden: 3,
      }
  ];
  for (const value of data) {
    const dataEntity = repository.create(value);
    await repository.save(dataEntity);
  }

  console.log('GaleriaImagenesEntity seeding completed.');
}

module.exports = {
  seedGalleryEntity,
};
