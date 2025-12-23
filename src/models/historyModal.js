const { default: mongoose } = require('mongoose');

const historySchema = new mongoose.Schema({
    user_id: { type:String, required: true, index: true},
    date: { type: String, required: true, index: true },
    history_data: { type: String, required: true, index: true }
});
historySchema.index({ user_id: 1, date: -1});

module.exports = mongoose.model("history", historySchema);