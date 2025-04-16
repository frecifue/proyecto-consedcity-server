const express = require("express");
const GeneralInfoController = require("../controllers/general_information");
const md_auth = require("../middlewares/authenticated");
// const multiparty = require("connect-multiparty");

// const md_upload = multiparty({uploadDir: "./uploads/usuarios/avatar"})
const api = express.Router();

api.get("/general_info", GeneralInfoController.getGeneralInformation);
api.post("/general_info", [md_auth.asureAuth], GeneralInfoController.createGeneralInformation);
api.patch("/general_info/:ingId", [md_auth.asureAuth], GeneralInfoController.updateGeneralInformation);
api.delete("/general_info/:ingId", [md_auth.asureAuth], GeneralInfoController.deleteGeneralInformation);


module.exports = api;