const emailController = require("../controller/email_controller.js")
const serviceController = require("../controller/service_controller.js")
const express = require("express")
const route = express.Router()
route.post("/sendEmail", emailController.sendEmail)
route.delete("/deleteall", serviceController.deleteAll)
module.exports = route