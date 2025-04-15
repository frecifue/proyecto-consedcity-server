const express = require("express");
const TypeUserController = require("../controllers/type_user");
const md_auth = require("../middlewares/authenticated");

const api = express.Router();

api.get("/type-users", [md_auth.asureAuth], TypeUserController.getTypeUsers);

module.exports = api;