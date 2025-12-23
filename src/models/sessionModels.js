const { default: mongoose } = require('mongoose');

const sessionDataSchema = new mongoose.Schema({
    current_topic: { type:String, default: ""},
    conversation_stage: { type:String, default: ""},
    active_context: { type:String, default: ""},
    immediate_next_step: { type:String, default: ""}
});

const sessionSchema = new mongoose.Schema({
    user_id: { type:String, required: true, index: true},
    date: { type: String, required: true, index: true },
    session_data: sessionDataSchema
});
sessionSchema.index({ user_id: 1, date: -1});

module.exports = mongoose.model("session", sessionSchema);