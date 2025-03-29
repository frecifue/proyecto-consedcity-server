const express = require("express");
const TeamController = require("../controllers/team");
const md_auth = require("../middlewares/authenticated");
const multiparty = require("connect-multiparty");

const md_upload = multiparty({uploadDir: "./uploads/team/foto_perfil"})
const api = express.Router();

api.get("/teams", TeamController.getTeams);
api.post("/team", [md_auth.asureAuth, md_upload], TeamController.createTeam);
api.patch("/team/:equId", [md_auth.asureAuth, md_upload], TeamController.updateTeam);
api.delete("/team/:equId", [md_auth.asureAuth], TeamController.deleteTeam);


module.exports = api;