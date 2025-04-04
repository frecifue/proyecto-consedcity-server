const { getRepository } = require("typeorm");
const { UsuarioEntity } = require("../entities/usuario");  // Importar el modelo User con TypeORM
const jwt = require("../utils/jwt");
const bcrypt = require("bcryptjs");
const { trimLowerCase } = require("../utils/cleanInput");

// const userRepository = getRepository(UsuarioEntity);

async function register(req, res) {
    let { nombres, primer_apellido, email, password } = req.body;

    nombres = trimLowerCase(nombres)
    primer_apellido = trimLowerCase(primer_apellido)
    email = trimLowerCase(email)
    password = password.trim()

    // Validaciones de campos obligatorios
    if (!nombres) {
        return res.status(400).send({ msg: "nombre obligatorio" });
    }
    if (!primer_apellido) {
        return res.status(400).send({ msg: "apellido obligatorio" });
    }
    if (!email) {
        return res.status(400).send({ msg: "email obligatorio" });
    }
    if (!password) {
        return res.status(400).send({ msg: "password obligatorio" });
    }

    try {
        // Obtener el repositorio de UsuarioEntity
        const userRepository = getRepository(UsuarioEntity);

        // Verificar si el email ya existe
        const existingUser = await userRepository.findOne({ where: { usu_email: email } });

        if (existingUser) {
            return res.status(400).send({ msg: "El email ya está registrado" });
        }

        // Crear el nuevo usuario
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        const newUser = userRepository.create({
            usu_nombres: nombres,
            usu_primer_apellido: primer_apellido,
            usu_email: email,
            usu_rol: "colaborador",
            usu_activo: false,
            usu_password: hashPassword,
        });

        // Guardar el nuevo usuario en la base de datos
        await userRepository.save(newUser);

        return res.status(200).send(newUser);
    } catch (error) {
        console.error(error);  // Agrega un log para ver detalles del error
        return res.status(500).send({ msg: "Error al crear usuario" });
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).send({ msg: "email obligatorio" });
    }
    if (!password) {
        return res.status(400).send({ msg: "password obligatorio" });
    }

    try {
        // Verificar si el email ya existe usando TypeORM
        const userRepository = getRepository(UsuarioEntity);
        const userStore = await userRepository.findOne({ where: { usu_email: email } });

        if (!userStore) {
            return res.status(400).send({ msg: "El email no existe" });
        }

        // Comprobar la contraseña con bcrypt
        bcrypt.compare(password, userStore.usu_password, (bcryptError, check) => {
            if (bcryptError) {
                return res.status(500).send({ msg: "error del servidor" });
            } else if (!check) {
                return res.status(400).send({ msg: "contraseña incorrecta" });
            } else if (!userStore.usu_activo) {
                return res.status(401).send({ msg: "el usuario está inactivo" });
            } else {
                // Generar y devolver los tokens
                return res.status(200).send({
                    access: jwt.createAccessToken(userStore),
                    refresh: jwt.createRefreshToken(userStore),
                });
            }
        });

    } catch (error) {
        console.error(error);  // Agrega un log para ver detalles del error
        return res.status(500).send({ msg: "Error al logear" });
    }
}

async function refreshAccessToken(req, res) {
    const { token } = req.body;

    if (!token) {
        return res.status(400).send({ msg: "token requerido" });
    }

    const { usu_id } = jwt.decoded(token);

    try {
        // Verificar si el usuario existe usando TypeORM
        const userRepository = getRepository(UsuarioEntity);
        const userStore = await userRepository.findOne({ where: { usu_id } });

        if (!userStore) {
            return res.status(400).send({ msg: "El usuario no existe" });
        } else {
            return res.status(200).send({
                accessToken: jwt.createAccessToken(userStore),
            });
        }

    } catch (error) {
        console.error(error);  // Agrega un log para ver detalles del error
        return res.status(500).send({ msg: "Error al refrescar token" });
    }
}



module.exports = {
    register,
    login,
    refreshAccessToken,
};
