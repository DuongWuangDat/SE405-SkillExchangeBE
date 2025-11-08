const tokenController = require("../controller/token_controller.js")
const express = require("express")
const route = express.Router()

route.get("/refresh-token", async (req,res)=>{
    const header = req.headers.authorization
    const split = header.split(" ")
    const token = split[1]
    const newToken = await tokenController.getAccessToken(token)
    return res.json({
        access_token: newToken
    })
})

route.delete("/deleteall", async (req,res)=>{
    await tokenController.deleteAllToken()
    return res.json({
        message: "Deleted successfully"
    })
})

route.post("/checktoken", async(req,res)=>{
    const token = req.body.token
    const isRevoked = await tokenController.checkTokenIsRevoked(token)
    const isExpired  = await tokenController.checkTokenIsExpired(token)
    if(isExpired){
        return res.status(401).json({
            message: "Token is expired"
        })
    }
    if(isRevoked){
        return res.status(401).json({
            message: "Token is revoked"
        })
    }
    return res.json({
        message : "Token is valid"
    })
})
module.exports= route