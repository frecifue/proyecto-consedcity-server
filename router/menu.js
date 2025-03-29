const express = require("express");
const MenuController = require("../controllers/menu");
const md_auth = require("../middlewares/authenticated");
// const multiparty = require("connect-multiparty");

// const md_upload = multiparty({uploadDir: "./uploads/usuarios/avatar"})
const api = express.Router();

// api.get("/user/me", [md_auth.asureAuth], UserController.getMe);
api.get("/menus", MenuController.getMenus);
api.post("/menu", [md_auth.asureAuth], MenuController.createMenu);
api.patch("/menu/:menId", [md_auth.asureAuth], MenuController.updateMenu);
api.delete("/menu/:menId", [md_auth.asureAuth], MenuController.deleteMenu);


module.exports = api;