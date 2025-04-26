const { AppDataSource } = require("../data-source");
const { UsuarioEntity } = require("../entities/usuario");  // Importar el modelo User con TypeORM
const { TipoUsuarioEntity } = require("../entities/tipo_usuario");  // Importar el modelo User con TypeORM
const bcrypt = require("bcryptjs");
const { trimLowerCase } = require("../utils/cleanInput");
const fileUtils = require("../utils/fileUtils");

const userRepository = AppDataSource.getRepository(UsuarioEntity);
const typeUserRepository = AppDataSource.getRepository(TipoUsuarioEntity);

async function getMe(req, res) {
    try {
        const { usu_id } = req.user || {}; // Evita que truene si req.user es undefined

        if (!usu_id) {
            return res.status(400).send({ msg: "usu_id no proporcionado" });
        }

        const existingUser = await userRepository.findOne({ where: { usu_id } });

        if (!existingUser) {
            return res.status(404).send({ msg: "Usuario no encontrado" });
        }

        return res.status(200).send(existingUser);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ msg: "Error al obtener usuario" });
    }
}


async function getUsers(req, res){
    const {activo} = req.query;
    let response = null;

    if(activo === undefined){
        response = await userRepository.find();
    }else{
        // Convertir el parametro a un valor numurico valido (0 o 1)
        let isActive;
        if (activo === "true") {
            isActive = 1;
        } else if (activo === "false") {
            isActive = 0;
        } else {
            isActive = parseInt(activo, 10);
        }

        if (isNaN(isActive)) {
            return res.status(400).send({ error: "El parámetro 'activo' debe ser 0 o 1" });
        }
        response = await userRepository.find({where: { usu_activo : isActive}});
    }

    return res.status(200).send(response);

}

async function createUser(req, res){
    let { nombres, primer_apellido, segundo_apellido, email, password, rol } = req.body;
    
    nombres = trimLowerCase(nombres)
    primer_apellido = trimLowerCase(primer_apellido)
    segundo_apellido = trimLowerCase(segundo_apellido)
    email = trimLowerCase(email)
    password = password ? password.trim() : null;
    rol = parseInt(rol)

    // Validaciones de campos obligatorios
    if (!nombres || !primer_apellido || !email || !password || isNaN(rol)) {

        if (req.files?.avatar) {
            fileUtils.cleanTempFile(req.files.avatar);
        }

        return res.status(400).send({ msg: "nombre obligatorio" });
    }

    try {
        // Verificar si el email ya existe
        const existingUser = await userRepository.findOne({ where: { usu_email: email } });

        if (existingUser) {

            if (req.files?.avatar) {
                fileUtils.cleanTempFile(req.files.avatar);
            }

            return res.status(400).send({ msg: "El email ya está registrado" });
        }

        // Validar existencia del rol
        const tipoUsuario = await typeUserRepository.findOne({ where: { tus_id: rol } });
        if (!tipoUsuario) {

            if (req.files?.avatar) {
                fileUtils.cleanTempFile(req.files.avatar);
            }

            return res.status(400).send({ msg: "El rol no existe" });
        }

        // Crear el nuevo usuario
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        const newUser = userRepository.create({
            usu_nombres         : nombres,
            usu_primer_apellido : primer_apellido,
            usu_segundo_apellido: segundo_apellido,
            usu_email           : email,
            tipo_usuario        : tipoUsuario,
            usu_activo          : 0,
            usu_password        : hashPassword,
        });

        if(req.files.avatar){
            newUser.usu_avatar = fileUtils.generateFilePath(req.files.avatar, "usuarios/avatar");
        }

        // Guardar el nuevo usuario en la base de datos
        await userRepository.save(newUser);

        return res.status(200).send(newUser);
    } catch (error) {

        if (req.files?.avatar) {
            fileUtils.cleanTempFile(req.files.avatar);
        }

        console.error(error);  // Agrega un log para ver detalles del error
        return res.status(400).send({ msg: "Error al crear usuario" });
    }

}

async function updateUser(req, res) {
    const { userId } = req.params;
    let { nombres, primer_apellido, segundo_apellido, email, password, rol, activo } = req.body;
    
    if (!userId) {

        if (req.files?.avatar) {
            fileUtils.cleanTempFile(req.files.avatar);
        }

        return res.status(400).send({ msg: "userId no encontrado" });
    }

    nombres = trimLowerCase(nombres)
    primer_apellido = trimLowerCase(primer_apellido)
    segundo_apellido = trimLowerCase(segundo_apellido)
    email = trimLowerCase(email)
    password = password ? password.trim() : null;
    rol = parseInt(rol);

    try {
        // Verificar si el usuario existe
        const user = await userRepository.findOne({ where: { usu_id: userId } });

        if (!user) {

            if (req.files?.avatar) {
                fileUtils.cleanTempFile(req.files.avatar);
            }

            return res.status(404).send({ msg: "Usuario no encontrado" });
        }

        // Verificar si se proporciona un nuevo email y si ya esta registrado
        if (email && email !== user.usu_email) {
            // Verificar si el nuevo email ya esta registrado
            const existingUser = await userRepository.findOne({ where: { usu_email: email } });
            if (existingUser) {

                if (req.files?.avatar) {
                    fileUtils.cleanTempFile(req.files.avatar);
                }

                return res.status(400).send({ msg: "El email ya está registrado" });
            }
            user.usu_email = email;
        }

        // Actualizar los campos del usuario si se proporcionan
        if (nombres) user.usu_nombres = nombres;
        if (primer_apellido) user.usu_primer_apellido = primer_apellido;
        if (segundo_apellido) user.usu_segundo_apellido = segundo_apellido;
        if (!isNaN(rol)) {
            const tipoUsuario = await typeUserRepository.findOne({ where: { tus_id: rol } });
            if (!tipoUsuario) {

                if (req.files?.avatar) {
                    fileUtils.cleanTempFile(req.files.avatar);
                }

                return res.status(400).send({ msg: "El rol no existe" });
            }
            user.tipo_usuario = tipoUsuario;
        }
    
        if (["true", true, 1, "1"].includes(activo)) {
            user.usu_activo = 1;
        } else if (["false", false, 0, "0"].includes(activo)) {
            user.usu_activo = 0;
        }
    
        if (password) {
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(password, salt);
            user.usu_password = hashPassword;
        }

        // Si se proporciona un nuevo avatar, actualizarlo
        if (req.files && req.files.avatar) {
            // Eliminar file anterior si existe
            if (user.usu_avatar) {
                fileUtils.deleteFile(user.usu_avatar);
            }

            user.usu_avatar = fileUtils.generateFilePath(req.files.avatar, "usuarios/avatar");
        }

        // Guardar los cambios
        await userRepository.save(user);

        return res.status(200).send(user);
    } catch (error) {

        if (req.files?.avatar) {
            fileUtils.cleanTempFile(req.files.avatar);
        }

        console.error(error);  // Agrega un log para ver detalles del error
        return res.status(400).send({ msg: "Error al actualizar usuario" });
    }
}


async function deleteUser(req, res) {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).send({ msg: "userId no encontrado" });
    }

    try {
        // Verificar si el usuario existe
        const user = await userRepository.findOne({ where: { usu_id: userId } });

        if (!user) {
            return res.status(404).send({ msg: "Usuario no encontrado" });
        }

        // Eliminar file anterior si existe
        if (user.usu_avatar) {
            fileUtils.deleteFile(user.usu_avatar);
        }

        // Eliminar el usuario
        await userRepository.remove(user); // Usar el metodo remove del repositorio

        return res.status(200).send({ msg: "Usuario eliminado exitosamente" });
    } catch (error) {
        console.error(error);  // Agrega un log para ver detalles del error
        return res.status(400).send({ msg: "Error al eliminar usuario", error: error.message });
    }
}

module.exports = {
    getMe,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
};