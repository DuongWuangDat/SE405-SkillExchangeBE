const chatModel = require('../model/chat.js')
const Message = require("../model/message.js")
const User = require("../model/user.js")
const Helper = require("../pkg/helper/helper.js")
//get all chatroom
const getAllChatRoom = async (req,res)=>{
    const chat = await chatModel.find().catch((err)=>{console.log(err)})
    res.json({
        data: chat
    })
}
//get chat by uid
const getChatByUId = async (req,res)=>{
    const firstID = req.params.uid
    const isValidId = await Helper.isValidObjectID(firstID)
    if(!isValidId){
        return res.status(400).json({
            message: "Invalid id"
        })
    }
    const chat = await chatModel.find({
        members: {$in: [firstID]}
    }).populate('members', 'username avatar isDelete')
    
    const dataChatList = []
    await Promise.all(chat.map( async (room)=>{
        // Kiểm tra xem có member nào bị xóa không
        const hasDeletedMember = room.members.some(member => member.isDelete === true)
        if(hasDeletedMember) return // Bỏ qua chat này nếu có user bị xóa
        
        const latestMessage = await Message.find({
            chatID: room._id
        }).sort({
            dateTime: -1
        }).limit(1).populate('senderID', 'username').catch((err)=>{
            return res.status(400).json({
                message: "Something went wrong"
            })
        })
        const dataChat = {
            chatInfo: room,
            latestMessage: latestMessage
        }
       
        dataChatList.push(dataChat)
    }))
    res.json({
        data: dataChatList
    })
}
//get chat by 2 uid
const getChatBy2UID = async (req,res)=>{
    const {firstID,secondID} = req.body
    const isValidFirstId = await Helper.isValidObjectID(firstID)
    const isValidSecondId = await Helper.isValidObjectID(secondID)
    if(!isValidFirstId || !isValidSecondId){
        return res.status(400).json({
            message: "Invalid id"
        })
    }
    try{
        const chat = await chatModel.find({
            members: {$all: [firstID,secondID]}
        }).populate("members", 'username avatar isDelete')
        const dataChatList = []
        await Promise.all(chat.map( async (room)=>{
            // Kiểm tra xem có member nào bị xóa không
            const hasDeletedMember = room.members.some(member => member.isDelete === true)
            if(hasDeletedMember) return // Bỏ qua chat này nếu có user bị xóa
            
            const latestMessage = await Message.find({
                chatID: room._id
            }).sort({
                dateTime: -1
            }).limit(1).populate('senderID', 'username').catch((err)=>{
                return res.status(400).json({
                    message: "Something went wrong"
                })
            })
            const dataChat = {
                chatInfo: room,
                latestMessage: latestMessage
            }
            dataChatList.push(dataChat)
        }))
        res.json({
            data: dataChatList
        })
    }
    catch(err){
        console.log(err)
    }
}
//create new chat
const createNewChat = async (req,res)=>{
    const {firstID, secondID} = req.body
    const isValidFirstId = await Helper.isValidObjectID(firstID)
    const isValidSecondId = await Helper.isValidObjectID(secondID)
    if(!isValidFirstId || !isValidSecondId){
        return res.status(400).json({
            message: "Invalid id"
        })
    }
    const user1 = await User.findById(firstID)
    const user2 = await User.findById(secondID)
    if(!user1 || !user2) return res.status(404).json({
        message: "User not found"
    })
    // Kiểm tra xem có user nào bị xóa không
    if(user1.isDelete || user2.isDelete) return res.status(400).json({
        message: "Cannot create chat with deleted user"
    })
    try{
        const existChat = await chatModel.findOne({
            members: {$all: [firstID,secondID]}
        })
        if(existChat) return res.status(400).json({
            message: "Something went wrong"
        })
        const chat = new chatModel({
            members: [firstID, secondID]
        })
        
        let chatInfo = await chat.save()
        chatInfo = await chatInfo.populate('members', 'username avatar')
        const chatData = {
            chatInfo: chatInfo,
            latestMessage: []
        }
        return res.json({
            message: "Create new chat successfully",
            data: chatData
        })
    }
    catch(err){
        console.log(err)
    }
    
}

const deleteChatRoom =async (req, res)=>{
    const id= req.params.id;
    const isValidId = await Helper.isValidObjectID(id)
    if(!isValidId){
        return res.status(400).json({
            message: "Invalid id"
        })
    }
    await Message.deleteMany({
        chatID: id
    }).catch((err)=>{
        return res.status(400).json({
            message: "Something went wrong"
        })
    })
    await chatModel.findByIdAndDelete(id).catch((err)=>{
        return res.status(400).json({
            message: "Something went wrong"
        })
    })

    return res.json({
        message: "Deleted chat successfully"
    })
}

module.exports= {getAllChatRoom,getChatBy2UID,getChatByUId,createNewChat,deleteChatRoom}