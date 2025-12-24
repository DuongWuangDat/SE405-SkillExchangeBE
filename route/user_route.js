const userController = require("../controller/user_controller.js");
const express = require("express");
const route = express.Router();

route.post("/register", userController.register);
route.post("/login", userController.login);
route.patch("/changePassword", userController.changePassword);
route.delete("/delete/:id", userController.deleteUser);
route.patch("/ban/:id", userController.banUser);
route.patch("/update/:id", userController.updateUser);
route.get("/find/topic", userController.getUserByTopic);
route.get("/find", userController.getAllUser);
route.get("/find/email", userController.getUserByEmail);
route.get("/findbyid/:id", userController.getUserById);
route.post("/logout", userController.logOut);
module.exports = route;
