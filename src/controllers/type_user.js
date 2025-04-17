const { AppDataSource } = require("../data-source");
const { TipoUsuarioEntity } = require("../entities/tipo_usuario");  // Importar el modelo User con TypeORM

const typeUserRepository = AppDataSource.getRepository(TipoUsuarioEntity);


async function getTypeUsers(req, res){

    response = await typeUserRepository.find();
    return res.status(200).send(response);

}

module.exports = {
    getTypeUsers,
   
};