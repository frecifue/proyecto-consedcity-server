const { PostEntity } = require('../../src/entities/post');
const {AppDataSource} = require('../../src/data-source');

async function seedPostEntity() {
  const repository = AppDataSource.getRepository(PostEntity);

    const data = [
        {
          pos_titulo: 'Introduction to JavaScript',
          pos_img_principal: 'intro_js.png',
          pos_contenido: 'JavaScript is a versatile programming language...',
          pos_path: '/posts/intro-to-js',
        },
        {
          pos_titulo: 'Understanding Asynchronous Programming',
          pos_img_principal: 'async_programming.png',
          pos_contenido: 'Asynchronous programming is a key concept in JavaScript...',
          pos_path: '/posts/async-programming',
        },
        {
          pos_titulo: 'Mastering Node.js',
          pos_img_principal: 'mastering_node.png',
          pos_contenido: 'Node.js is a powerful tool for building server-side applications...',
          pos_path: '/posts/mastering-node',
        },
      ];

  try {
    for (const value of data) {
      const dataEntity = repository.create(value);
      await repository.save(dataEntity);
    }

    console.log('Sample posts have been added successfully.');
  } catch (error) {
    console.error('Error seeding posts:', error);
  }
};

module.exports = { seedPostEntity };
