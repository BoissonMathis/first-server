const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

var ArticleSchema = mongoose.Schema({
    user_id: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: [1]
    },
    quantity: {
        type: Number,
        required: true,
        min: [1]
    },
    created_at: {
        type: Date,
        default: new Date()
    },
    updated_at: {
        type: Date,
    },
})

module.exports = ArticleSchema