const Chat = require('../models/chatModels');

async function newChat(userId, title, mode, message) {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
    const newChat = new Chat({
        user_id: userId,
        date: formattedDate,
        title,
        mode,
        messages: message
    });
    // addMessage(formattedDate, userId, mode, message);
    // deleteChat(formattedDate, userId, mode);
    // await newChat.save();
}

async function deleteChat(date, userId, mode){
    const response = await Chat.deleteOne({
        date,
        user_id: userId,
        mode
    });
    console.log("this is the respose ", response);
}

async function addMessage(date, userId, mode, message) {
    const chat = await isChatExisting(date, userId, mode);
    chat.messages.push(message);
    const response = await chat.save();
    console.log("this is the respose ", response);
}

async function updateMessage(date, userId, mode, message) {
    const chat = await updateOne({
        date,
        user_id: userId,
        mode
    },{message});
    chat.messages.push(message);
    const response = await chat.save();
    console.log("this is the respose ", response);
}

async function isChatExisting(date, userId, mode){
    const response = await Chat.findOne({
        date,
        user_id: userId,
        mode
    });
    // console.log("this is the respose ", response);
    return response;
}

module.exports = newChat;