const Chat = require("../model/chat")
const Message = require("../model/message")
const Request = require("../model/request")
const Token = require("../model/token")
const User = require("../model/user")
const deleteAll = async(req,res)=>{
    await User.deleteMany({})
    await Token.deleteMany({})
    await Request.deleteMany({})
    await Message.deleteMany({})
    await Chat.deleteMany({})
    return res.json({
        message: "Deleted successfully"
    })
}

module.exports = {deleteAll}