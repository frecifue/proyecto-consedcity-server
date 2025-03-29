const { getRepository } = require("typeorm");
const { UsuarioEntity } = require("../entities/usuario");  // Importar el modelo User con TypeORM
const bcrypt = require("bcryptjs");
const image = require("../utils/image");
const fs = require("fs");
const path = require("path");

async function getMe(req, res){
    const {usu_id} = req.user;

    try {
        // Verificar si el email ya existe
        const userRepository = getRepository(UsuarioEntity);
        const existingUser = await userRepository.findOne({ where: { usu_id } });

        if (!existingUser) {
            return res.status(400).send({ msg: "usuario no encontrado" });
        }

        return res.status(200).send(existingUser);
    } catch (error) {
        console.error(error);  // Agrega un log para ver detalles del error
        return res.status(500).send({ msg: "Error al obtener usuario" });
    }
}

async function getUsers(req, res){
    const {activo} = req.query;
    let response = null;

    const userRepository = getRepository(UsuarioEntity);

    if(activo === undefined){
        response = await userRepository.find();
    }else{
        // Convertir el parámetro a un valor numérico válido (0 o 1)
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
    const { nombres, primer_apellido, email, password, rol } = req.body;
    //console.log(req.body);


    // return res.status(200).send({msg: 'ok'});

    // Validaciones de campos obligatorios
    if (!nombres) {
        return res.status(400).send({ msg: "nombre obligatorio" });
    }
    if (!primer_apellido) {
        return res.status(400).send({ msg: "primer apellido obligatorio" });
    }
    if (!email) {
        return res.status(400).send({ msg: "email obligatorio" });
    }
    if (!password) {
        return res.status(400).send({ msg: "password obligatorio" });
    }
    if (!rol) {
        return res.status(400).send({ msg: "rol obligatorio" });
    }

    try {
        // Verificar si el email ya existe
        const userRepository = getRepository(UsuarioEntity);
        // const existingUser = await userRepository.findOne({ email: email.toLowerCase() });
        const existingUser = await userRepository.findOne({ where: { usu_email: email.toLowerCase() } });

        if (existingUser) {
            return res.status(400).send({ msg: "El email ya está registrado" });
        }

        // Crear el nuevo usuario
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        const newUser = userRepository.create({
            usu_nombres: nombres.toLowerCase(),
            usu_primer_apellido: primer_apellido.toLowerCase(),
            usu_email: email.toLowerCase(),
            usu_rol: rol,
            usu_activo: 0,
            usu_password: hashPassword,
        });

        if(req.files.avatar){
            newUser.usu_avatar = image.getFilePath(req.files.avatar)
        }

        // Guardar el nuevo usuario en la base de datos
        // const userStorage = await newUser.save();
        await userRepository.save(newUser);

        return res.status(200).send(newUser);
    } catch (error) {
        console.error(error);  // Agrega un log para ver detalles del error
        return res.status(400).send({ msg: "Error al crear usuario" });
    }

}

async function updateUser(req, res) {
    const { userId } = req.params;
    console.log(userId);
    const { nombres, primer_apellido, segundo_apellido, email, password, rol, activo } = req.body;
    
    if (!userId) {
        return res.status(400).send({ msg: "userId no encontrado" });
    }

    try {
        // Verificar si el usuario existe
        const userRepository = getRepository(UsuarioEntity);
        const user = await userRepository.findOne({ where: { usu_id: userId } });

        if (!user) {
            return res.status(404).send({ msg: "Usuario no encontrado" });
        }

        // Verificar si se proporciona un nuevo email y si ya está registrado
        if (email && email !== user.usu_email) {
            // Verificar si el nuevo email ya está registrado
            const existingUser = await userRepository.findOne({ where: { usu_email: email.toLowerCase() } });
            if (existingUser) {
                return res.status(400).send({ msg: "El email ya está registrado" });
            }
            user.usu_email = email.toLowerCase();
        }

        // Actualizar los campos del usuario si se proporcionan
        if (nombres) user.usu_nombres = nombres.toLowerCase();
        if (primer_apellido) user.usu_primer_apellido = primer_apellido.toLowerCase();
        if (segundo_apellido) user.usu_segundo_apellido = segundo_apellido.toLowerCase();
        if (rol) user.usu_rol = rol;
    
        if (activo === "true") {
            user.usu_activo = 1;
        } else if (activo === "false") {
            user.usu_activo = 0;
        } else {
            user.usu_activo = parseInt(activo, 10);
        }
    
        if (isNaN(user.usu_activo) || (user.usu_activo !== 1 && user.usu_activo !== 0)) {
            user.usu_activo = 0;
        }
    
        if (password) {
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(password, salt);
            user.usu_password = hashPassword;
        }

        // Si se proporciona un nuevo avatar, actualizarlo
        if (req.files && req.files.avatar) {
            // Eliminar el avatar anterior si existe
            if (user.usu_avatar) {
                const avatarPath = path.join(__dirname, "..", "uploads", user.usu_avatar);
                fs.unlink(avatarPath, (err) => {
                    if (err) {
                        console.error("Error al eliminar el avatar anterior:", err);
                    } else {
                        console.log("Avatar anterior eliminado");
                    }
                });
            }

            // Guardar el nuevo avatar
            user.usu_avatar = image.getFilePath(req.files.avatar);
        }

        // Guardar los cambios
        // const updatedUser = await user.save();
        console.log(user);
        await userRepository.save(user);

        return res.status(200).send(user);

        // return res.status(200).send(updatedUser);
    } catch (error) {
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
        const userRepository = getRepository(UsuarioEntity);
        // const user = await userRepository.findOne({ where: { usu_id } });
        const user = await userRepository.findOne({ where: { usu_id: userId } });

        if (!user) {
            return res.status(404).send({ msg: "Usuario no encontrado" });
        }

        // Verificar si el usuario tiene un avatar y eliminar el archivo
        if (user.usu_avatar) {
            // Obtener la ruta relativa del avatar
            const avatarPath = path.join(__dirname, "..", "uploads", user.usu_avatar);

            console.log("Intentando eliminar el archivo en: ", avatarPath);

            // Eliminar el archivo de avatar
            fs.unlink(avatarPath, (err) => {
                if (err) {
                    console.error("Error al eliminar el avatar:", err);
                } else {
                    console.log("Avatar eliminado exitosamente");
                }
            });
        }

        // Eliminar el usuario
        // await user.deleteOne();
        await userRepository.remove(user); // Usar el método remove del repositorio

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