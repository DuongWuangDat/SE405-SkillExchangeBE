const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reportSchema = new Schema({
    senderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    targetID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    evidence: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isResolved: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const reportModel = mongoose.model('Report', reportSchema)
module.exports = reportModel
