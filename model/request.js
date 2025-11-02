const mongoose = require("mongoose")
const Schema = mongoose.Schema
const requestSchema = new Schema({
    senderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    dateTime: {
        type: Date,
        default: Date.now,
    }
})

const requestModel = mongoose.model("Request", requestSchema)
module.exports= requestModel