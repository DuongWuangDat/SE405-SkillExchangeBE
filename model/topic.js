const mongoose = require("mongoose")
const Schema = mongoose.Schema
const topicSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    }
})

topicSchema.virtual("id").get(function(){
    return this._id.toHexString
})

topicSchema.set("toJSON", {
    "virtuals": true
})
const topicModel = mongoose.model("Topic",topicSchema)
module.exports = topicModel