const { AppDataSource } = require("../data-source");
const { InformacionGeneralEntity } = require("../entities/informacion_general");  // Importar el modelo User con TypeORM

const generalInfoRepository = AppDataSource.getRepository(InformacionGeneralEntity);

async function getGeneralInformation(req, res){
    
    response = await generalInfoRepository.find();
    
    return res.status(200).send(response);

}

async function createGeneralInformation(req, res){
    let { quienes_somos, mision, vision, nuestro_trabajo, difusion, formacion, investigacion } = req.body;

    quienes_somos = (quienes_somos || "").trim();
    mision = (mision || "").trim();
    vision = (vision || "").trim();
    nuestro_trabajo = (nuestro_trabajo || "").trim();
    difusion = (difusion || "").trim();
    formacion = (formacion || "").trim();
    investigacion = (investigacion || "").trim();


    try {
        
        let existingGeneralInfo = (await generalInfoRepository.find())[0];

        if (existingGeneralInfo) {
            // Si ya existe, actualizar el registro en lugar de crear uno nuevo
            existingGeneralInfo.ing_quienes_somos = quienes_somos || existingGeneralInfo.ing_quienes_somos;
            existingGeneralInfo.ing_mision = mision || existingGeneralInfo.ing_mision;
            existingGeneralInfo.ing_vision = vision || existingGeneralInfo.ing_vision;
            existingGeneralInfo.ing_nuestro_trabajo = nuestro_trabajo || existingGeneralInfo.ing_nuestro_trabajo;
            existingGeneralInfo.ing_nuestro_trabajo_difusion = difusion || existingGeneralInfo.ing_nuestro_trabajo_difusion;
            existingGeneralInfo.ing_nuestro_trabajo_formacion = formacion || existingGeneralInfo.ing_nuestro_trabajo_formacion;
            existingGeneralInfo.ing_nuestro_trabajo_investigacion = investigacion ?? existingGeneralInfo.ing_nuestro_trabajo_investigacion; // Para booleanos

            await generalInfoRepository.save(existingGeneralInfo);

            return res.status(200).send({ msg: "Información General actualizada", data: existingGeneralInfo });
        }

        // Si no existe, crear un nuevo registro
        const newGeneralInfo = generalInfoRepository.create({
            ing_quienes_somos: quienes_somos,
            ing_mision: mision,
            ing_vision: vision,
            ing_nuestro_trabajo: nuestro_trabajo,
            ing_nuestro_trabajo_difusion: difusion,
            ing_nuestro_trabajo_formacion: formacion,
            ing_nuestro_trabajo_investigacion: investigacion,
        });

        await generalInfoRepository.save(newGeneralInfo);

        return res.status(201).send(newGeneralInfo);

    } catch (error) {
        console.error(error);  // Agrega un log para ver detalles del error
        return res.status(400).send({ msg: "Error al crear informacion general" });
    }

}

async function updateGeneralInformation(req, res) {
    const { ingId } = req.params;
    let { quienes_somos, mision, vision, nuestro_trabajo, difusion, formacion, investigacion } = req.body;
    
    if (!ingId) {
        return res.status(400).send({ msg: "ingId no encontrado" });
    }

    quienes_somos = (quienes_somos || "").trim();
    mision = (mision || "").trim();
    vision = (vision || "").trim();
    nuestro_trabajo = (nuestro_trabajo || "").trim();
    difusion = (difusion || "").trim();
    formacion = (formacion || "").trim();
    investigacion = (investigacion || "").trim();

    try {
        // Verificar si existe
        const generalInfo = await generalInfoRepository.findOne({ where: { ing_id: ingId } });

        if (!generalInfo) {
            return res.status(404).send({ msg: "Información General no encontrada" });
        }

        // Actualizar los campos del usuario si se proporcionan
        if (quienes_somos) generalInfo.ing_quienes_somos = quienes_somos;
        if (mision) generalInfo.ing_mision = mision;
        if (vision) generalInfo.ing_vision = vision;
        if (nuestro_trabajo) generalInfo.ing_nuestro_trabajo = nuestro_trabajo;
        if (difusion) generalInfo.ing_nuestro_trabajo_difusion = difusion;
        if (formacion) generalInfo.ing_nuestro_trabajo_formacion = formacion;
        if (investigacion) generalInfo.ing_nuestro_trabajo_investigacion = investigacion;


        // Guardar los cambios
        await generalInfoRepository.save(generalInfo);

        return res.status(200).send(generalInfo);

    } catch (error) {
        console.error(error);  // Agrega un log para ver detalles del error
        return res.status(400).send({ msg: "Error al actualizar información general" });
    }
}


async function deleteGeneralInformation(req, res) {
    const { ingId } = req.params;

    if (!ingId) {
        return res.status(400).send({ msg: "ingId no encontrado" });
    }

    try {
        // Verificar si existe
        const generalInfo = await generalInfoRepository.findOne({ where: { ing_id: ingId } });

        if (!generalInfo) {
            return res.status(404).send({ msg: "Información General no encontrado" });
        }

        // Eliminar
        await generalInfoRepository.remove(generalInfo); 

        return res.status(200).send({ msg: "Información General eliminada exitosamente" });
    } catch (error) {
        console.error(error);  // Agrega un log para ver detalles del error
        return res.status(400).send({ msg: "Error al eliminar informacion general", error: error.message });
    }
}

module.exports = {
    getGeneralInformation,
    createGeneralInformation,
    updateGeneralInformation,
    deleteGeneralInformation,
};