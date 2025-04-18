const express = require("express");
const PostController = require("../controllers/post");
const md_auth = require("../middlewares/authenticated");
const multiparty = require("connect-multiparty");

const api = express.Router();
const md_upload = multiparty();

api.get("/posts", PostController.getPosts);
api.get("/post/:path", PostController.getPost);
api.post("/post", [md_auth.asureAuth, md_upload], PostController.createPost);
api.post("/post/:posId/add-documents", [md_auth.asureAuth, md_upload], PostController.addDocuments);
api.post("/post/:posId/add-images", [md_auth.asureAuth, md_upload], PostController.addImages);
api.patch("/post/:posId", [md_auth.asureAuth, md_upload], PostController.updatePost);
api.delete("/post/:posId", [md_auth.asureAuth], PostController.deletePost);


module.exports = api;