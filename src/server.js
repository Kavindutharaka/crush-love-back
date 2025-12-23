const connectMongoDB = require('./config/mongoDb');
const connectNeo4J = require('./config/neo4j');
const con_collector = require('./controllers/agentController');
const newChat = require('./controllers/chatcontroller');
const express = require('express');
const jwt = require('jsonwebtoken');
const llmRun = require('./controllers/geminiController');
const llmresposeConverter = require('./controllers/jsonController');
const app = express();
const port = 3001;
app.use(express.json());

// const payload = { uId : '12', role: 'admin'}
// const secretKey = "lololo";
// const options = { expiresIn: '24h' };
// const token = jwt.sign(payload, secretKey, options);
// console.log(token);
const msg = [
    {   role: "user",
        content: "Ahh i stuck this"
    }
]
const new_msg = {   role: "assistant",
        content: "Im in your side don't worry!" }
connectMongoDB();
newChat('U001', 'demo', 'question', new_msg);
connectNeo4J();


// memory_extractor();

app.post('/', async (req,res) =>{
    const {msg} = req.body;
    const response = await con_collector(msg);
    res.send(response);
});


app.listen(port, ()=>{
    console.log(`Server running on ${port} port!`);
});