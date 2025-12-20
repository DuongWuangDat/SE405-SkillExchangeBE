const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")
const authJwt = require("./pkg/middleware/expressJwt.js")
const userRoute = require("./route/user_route.js")
const topicRoute = require("./route/topic_route.js")
const tokenRoute = require("./route/token_route.js")
const chatRoute = require('./route/chat_route.js')
const messageRoute = require('./route/message_route.js')
const requestRoute = require("./route/request_route.js")
const uploadRoute = require("./route/upload_route.js")
const serviceRoute = require("./route/service_route.js")
const reportRoute = require("./route/report_route.js")
const http = require("http").createServer(app)

require("dotenv").config()

const port = process.env.PORT
const url = process.env.ATLAS_URI
const api = process.env.API_URL

///Prepare mongoDB and run server///
mongoose.connect(url).then(
    res =>{
        console.log("Connect mongoDB successfully");
        http.listen(port, ()=>{
                console.log("Listen and run at port: " + port)
        })
    }
).catch(
    err=>{
        console.log(err)
    }
)
///Prepare mongoDB and run server///

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(authJwt())
app.use('/public/uploads', express.static(__dirname + '/public/uploads'))
app.get("/ping", (req,res)=>{
    return res.status(200).json({
        message: "pong"
    })
})

app.use(`${api}/user`, userRoute)
app.use(`${api}/topic`, topicRoute)
app.use(`${api}/token`, tokenRoute)
app.use(`${api}/chat`,chatRoute)
app.use(`${api}/message`, messageRoute)
app.use(`${api}/request`,requestRoute)
app.use(`${api}/upload`, uploadRoute)
app.use(`${api}/service`, serviceRoute)
app.use(`${api}/report`, reportRoute)
///--------------------Socket------------------///
const {Server} = require("socket.io")
const io = new Server(http, {
    cors: {
        origin: "*"
    }
})
let onlineUsers = []
io.on("connection", (socket)=>{
    console.log(`${socket.id} connected`)
    
    socket.on("addOnlineUser", (userID)=>{
       const check = onlineUsers?.some((user) => user.userID == userID) 
       if(check){
        const index = onlineUsers.findIndex((user) => user.userID == userID)
        onlineUsers[index].socketID = socket.id
       }else{
        onlineUsers.push({
            userID: userID,
            socketID: socket.id
        })
       }
        
        console.log(onlineUsers)
        io.emit("getOnlineUsers", onlineUsers)
    })
    
    socket.on("sendMessage", (req)=>{
        console.log(req.recipientID)
        const user = onlineUsers.find((userFind) => userFind.userID == req.recipientID)
        console.log(user)
        if(user){
            io.to(user.socketID).emit("getMessage", req)
            io.to(user.socketID).emit("getLatestMessage", req)
        }
    })

    socket.on("unfriend", (req) =>{
        const user = onlineUsers.find((userFind) => userFind.userID == req.recipientID)
        console.log("unfriend" +user)
        if(user){
            io.to(user.socketID).emit("isUnFriend", req)
            io.to(user.socketID).emit("deleteChatRoom", req)
        }
    })

    socket.on("acceptrequest", (req) =>{
        const user = onlineUsers.find((userFind) => userFind.userID == req.recipientID)
        if(user){
            io.to(user.socketID).emit("getnewchatroom", req.chatData)
        }
    })
    socket.on("disconnect", ()=>{
        onlineUsers = onlineUsers.filter((user)=> user.socketID !== socket.id)
        console.log(onlineUsers)
        io.emit("getOnlineUsers", onlineUsers)
    })

    
    
})

function createUniqueId() {
    return Math.random().toString(20).substring(2, 10);
  }


