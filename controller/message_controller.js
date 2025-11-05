const Message = require('../model/message.js')
const User = require("../model/user.js")
const Chat = require("../model/chat.js")
const Helper = require("../pkg/helper/helper.js")
// post message
const sendMessage = async(req,res)=>{
    try{
        const senderID = req.body.senderID
        const chatID = req.body.chatID
        const isValidSenderID = await Helper.isValidObjectID(senderID)
        const isValidChatID = await Helper.isValidObjectID(chatID)
        if(!isValidChatID || !isValidSenderID) return res.status(400).json({
            message: "Invalid id"
        })
        const user = await User.findById(req.body.senderID)
        if(!user) return res.status(404).json({
            message: "User not found"
        })
        const chat = await Chat.findById(req.body.chatID)
        if(!chat) return res.status(404).json({
            message: "Chat not found"
        })
        const message = new Message(req.body)
        const dataMessage = await message.populate('senderID', 'username avatar')
        await message.save().then(result=>{
            return res.json({
                message: "Send message successfully",
                data: dataMessage
            })
        }).catch((err)=>{
            return res.status(400).json({
                message: "Something went wrong",
            })
        })
    }
    catch(err){
        console.log(err)
    }
}
// message in chat room ID
const getMessageByChatID = async(req,res)=>{
    try{
        const chatID = req.params.chatID
        const isValidChatID = await Helper.isValidObjectID(chatID)
        if(!isValidChatID) return res.status(400).json({
            message: "Invalid id"
        })
        const message = await Message.find({chatID: chatID}).populate("senderID", "username avatar")
        res.json({
            data: message
        })
    }
    catch(err){
        console.log(err)
    }
}
//message in chat room ID by senderID
const getMessageByBoth =async(req,res)=>{
    try{
        const chatID = req.query.chatID
        const senderID = req.query.senderID
        const isValidSenderID = await Helper.isValidObjectID(senderID)
        const isValidChatID = await Helper.isValidObjectID(chatID)
        if(!isValidChatID || !isValidSenderID) return res.status(400).json({
            message: "Invalid id"
        })
        const message = await Message.find({chatID: chatID, senderID:senderID}).populate("senderID", "username avatar")
        res.json({
            data: message
        })
    }
    catch(err){
        console.log(err)
    }
}
module.exports = {sendMessage,getMessageByBoth,getMessageByChatID}