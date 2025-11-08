const topicController = require("../controller/topic_controller.js")
const express = require("express")
const route = express.Router()

route.post("/create", topicController.addNewTopic)
route.post("/create/many", topicController.addManyTopic)
route.delete("/delete/:id",topicController.deleteTopic)
route.patch("/update/:id", topicController.updateTopic)
route.get("/find", topicController.getAllTopic)
route.get("/find/:id", topicController.getTopicById)
route.get("/limit/:limit", topicController.getTopicLimit)
route.get("/pagination", topicController.getTopicPagination)
route.delete("/deleteall", topicController.deleteAll)
module.exports = route