const Message = require('../model/message.js')
const User = require("../model/user.js")
const Chat = require("../model/chat.js")
const Helper = require("../pkg/helper/helper.js")
const { detectToxicity } = require("../pkg/helper/toxicityDetection.js")
// post message
const sendMessage = async(req,res)=>{
    try{
        const senderID = req.body.senderID
        const chatID = req.body.chatID
        const content = req.body.content
        
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
        
        // Kiểm tra nội dung toxic nếu là tin nhắn text
        if(req.body.type === 'text' || !req.body.type){
            const toxicityResult = await detectToxicity(content)
            
            if(toxicityResult.isToxic){
                return res.status(400).json({
                    message: "Your message contains inappropriate content and cannot be sent",
                    messageToxic: "Tin nhắn của bạn chứa nội dung không phù hợp và không thể gửi",
                    toxicity: {
                        label: toxicityResult.label,
                        confidence: toxicityResult.confidence || toxicityResult.score
                    }
                })
            }
        }
        
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

// delete message by id (only sender can delete)
const deleteMessage = async(req,res)=>{
    try{
        const messageID = req.params.id
        const senderID = req.body.senderID
        
        const isValidMessageID = await Helper.isValidObjectID(messageID)
        const isValidSenderID = await Helper.isValidObjectID(senderID)
        
        if(!isValidSenderID) return res.status(400).json({
            message: "Invalid sender id"
        })

        if(!isValidMessageID) return res.status(400).json({
            message: "Invalid message id"
        })

        
        const message = await Message.findById(messageID)
        if(!message) return res.status(404).json({
            message: "Message not found"
        })
        
        // Kiểm tra xem người xóa có phải là người gửi không
        if(message.senderID.toString() !== senderID) return res.status(403).json({
            message: "You don't have permission to delete this message"
        })
        
        await Message.findByIdAndDelete(messageID)
        res.json({
            message: "Delete message successfully"
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}


module.exports = {sendMessage,getMessageByBoth,getMessageByChatID,deleteMessage}