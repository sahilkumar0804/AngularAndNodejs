const express =require('express');

const UserController = require("../controllers/user");

const router = express.Router();

router.post("/login", UserController.userLogin);

router.post("/signup", UserController.createUser);

module.exports =router;
