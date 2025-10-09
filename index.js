const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3001;
app.use(express.json());

const payload = { uId : '12', role: 'admin'}
const secretKey = "lololo";
const options = { expiresIn: '24h' };
const token = jwt.sign(payload, secretKey, options);
console.log(token);


app.listen(port, ()=>{
    console.log(`Server running on ${port} port!`);
})