const express = require("express");
const PostController = require("../controllers/post");
const md_auth = require("../middlewares/authenticated");
const multiparty = require("connect-multiparty");

const md_upload = multiparty({uploadDir: "./uploads/posts/img_principal"})
const api = express.Router();

api.get("/posts", PostController.getPosts);
api.get("/post/:path", PostController.getPost);
api.post("/post", [md_auth.asureAuth, md_upload], PostController.createPost);
api.patch("/post/:posId", [md_auth.asureAuth, md_upload], PostController.updatePost);
api.delete("/post/:posId", [md_auth.asureAuth], PostController.deletePost);


module.exports = api;