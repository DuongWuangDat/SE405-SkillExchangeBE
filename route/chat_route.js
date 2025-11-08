const express = require('express')
const chatController = require('../controller/chat_controller.js')
const route = express.Router()
route.get('/find',chatController.getAllChatRoom)
route.get('/find/:uid',chatController.getChatByUId)
route.get('/find/both',chatController.getChatBy2UID)
route.post('/create', chatController.createNewChat)
route.delete('/delete/:id', chatController.deleteChatRoom)
module.exports = route