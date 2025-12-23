const express = require('express');
const chat = express.Router();

// new chat
chat.post('/chat');
// update chat
chat.put('/chat');
chat.get('/chat');
chat.delete('/chat');
