const express = require('express')
const messageController = require('../controller/message_controller.js')
const route = express.Router()
route.post('/send', messageController.sendMessage)
route.get('/find/:chatID',messageController.getMessageByChatID )
route.get('/findbyboth',messageController.getMessageByBoth)
route.delete('/delete/:id', messageController.deleteMessage)
module.exports = route