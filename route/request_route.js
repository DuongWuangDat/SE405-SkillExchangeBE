const requestController = require("../controller/request_controller.js")
const express = require("express")
const route = express.Router()

route.get("/find/sender/:senderID", requestController.getRequestBySenderId)
route.get("/find/receiver/:receiverID", requestController.getRequestByRecieverId)
route.post("/create", requestController.createNewRequest)
route.delete("/delete/:id", requestController.deleteRequest)
route.delete("/deletebysenderid", requestController.deleteRequestBySenderId)

module.exports = route
