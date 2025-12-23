const { default: mongoose } = require('mongoose');
const connectMongoDB = require('../config/mongoDb');

const MessageSchema = new mongoose.Schema({
    role: String,
    content: String,
    timestamp: { type: Date, default: Date.now },
});
const ChatScehma = new mongoose.Schema({
    user_id: { type:String, required: true, index: true},
    date: { type: String, required: true, index: true },
    title: { type:String, default: ""},
    summary: { type:String, default: ""},
    mode: { type:String, enum: ["question", "story"], required: true},
    messages: [MessageSchema]
});
ChatScehma.index({ user_id: 1, date: -1});

module.exports = mongoose.model("Chat", ChatScehma);