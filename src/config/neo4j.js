const neo4j = require('neo4j-driver');
require('dotenv').config();

const URI = process.env.NEO4J_URI;
const USER = process.env.NEO4J_USER;
const PASSWORD = process.env.NEO4J_PASS;

const connectGraph = async () =>{
    try{
        console.log(USER, PASSWORD);
        const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
        const serverInfo = await driver.getServerInfo();
        console.log('Connection established');
        // console.log(serverInfo);
        return driver;
    }catch(error){
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

;

module.exports = connectGraph;