const express = require("express");
const MenuController = require("../controllers/menu");
const md_auth = require("../middlewares/authenticated");

const api = express.Router();

api.get("/menus", MenuController.getMenus);
api.post("/menu", [md_auth.asureAuth], MenuController.createMenu);
api.patch("/menu/:menId", [md_auth.asureAuth], MenuController.updateMenu);
api.delete("/menu/:menId", [md_auth.asureAuth], MenuController.deleteMenu);


module.exports = api;