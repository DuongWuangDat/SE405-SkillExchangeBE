const mongoose = require('mongoose')
const Schema = mongoose.Schema
const chatSchema = new Schema({
    members: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    }]
},{
    timestamps: true
}
)
const chatModel = mongoose.model('Chat',chatSchema)
module.exports = chatModel