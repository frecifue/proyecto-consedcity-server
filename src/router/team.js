const express = require("express");
const TeamController = require("../controllers/team");
const md_auth = require("../middlewares/authenticated");
const multiparty = require("connect-multiparty");

const api = express.Router();
const md_upload = multiparty();  // Sin pasar el uploadDir aquí, ya que lo maneja el middleware

api.get("/teams", TeamController.getTeams);
api.post("/team", [md_auth.asureAuth, md_upload], TeamController.createTeam);
api.patch("/team/:equId", [md_auth.asureAuth, md_upload], TeamController.updateTeam);
api.delete("/team/:equId", [md_auth.asureAuth], TeamController.deleteTeam);


module.exports = api;