const { writeFile, appendFile } = require('node:fs/promises');
const llmRun = require('./geminiController');
const router = require("../prompts/memeory/router");
const { performance } = require('perf_hooks');
const conversation_collector = require("../prompts/agent/conversation");

// const  extractor  = require("../prompts/memeory/extractor");
// const  session_maneger  = require("../prompts/memeory/sessionManager");
// const  longterm_maneger  = require("../prompts/memeory/longTermManager");

const  extractor  = require("../prompts/gemini/extractor");
const  session_maneger  = require("../prompts/gemini/sessionManager");
const  longterm_maneger  = require("../prompts/gemini/longTermManager");
const llmresposeConverter = require('./jsonController');
const { session_save, get_session_data } = require('./sessionController');
const { history_save } = require('./historyController');
const { saveKnowledgeGraphUpdates } = require('./kgController');

async function saveNote(filename, content, append = false) {
  try {
    if (append) {
      await appendFile(filename, content + '\n'); // Append with a newline
      console.log(`Content appended to ${filename}`);
    } else {
      await writeFile(filename, content); // Overwrite existing content
      console.log(`Content written to ${filename}`);
    }
  } catch (err) {
    console.error('Error writing to file:', err);
  }
}

const memory_extractor = async (message)=>{
    const start = performance.now();

    const prompt = extractor(message);
    const response = await llmRun(prompt);

    const end = performance.now();
    const ms = end - start;             // total milliseconds
    const sec = (ms / 1000).toFixed(2); // convert to seconds
    console.log(`Memory Extractor Time: ${sec}s (${ms.toFixed(2)}ms)`);

    if(response){
        saveNote('memory_extractor.txt', response);
    }
    return response;
};

// const formattedJson =(jsx)=>{
//     const jsonString = jsx.replace(/```json|```/g, "").trim();
//     console.log("this is formatted json: ", jsonString);
// };

const route_manager = async(msg)=>{
    const start = performance.now();

    const extracted_memory = await memory_extractor(msg);
    if(!extracted_memory){
        return;
    } 
    const prompt = router(extracted_memory);
    const response = await llmRun(prompt);

    const end = performance.now();
    const ms = end - start;             // total milliseconds
    const sec = (ms / 1000).toFixed(2); // convert to seconds
    console.log(`Route Manager Time: ${sec}s (${ms.toFixed(2)}ms)`);

    if(response){
        saveNote('route_manage.txt', response);
    }
    return response;
};

const con_collector = async (msg)=>{
  const prompt = conversation_collector(msg);
  const response = await llmRun(prompt);
  return response;
};

// const memory_agent = async(msg)=>{
//   const start = performance.now();

//   const ex_prompt = await extractor(msg);
//   const ex_res = await llmRun(ex_prompt);
//   if(!ex_res){
//     return;
//   }
//   saveNote('prompt_txt/data_extractor.txt',ex_res);

//   const ses_prompt = await session_maneger(ex_res);
//   const ses_res = await llmRun(ses_prompt);
//   if(!ses_res){
//     return;
//   }
//   saveNote('prompt_txt/session.txt',ses_res);

//   const long_prompt = await longterm_maneger(ses_res);
//   const long_res = await llmRun(long_prompt);
//   if(!long_res){
//     return;
//   }
//   saveNote('prompt_txt/long.txt',long_res);

//   const end = performance.now();
//   const ms = end - start;             // total milliseconds
//   const sec = (ms / 1000).toFixed(2); // convert to seconds
//   console.log(`Route Manager Time: ${sec}s (${ms.toFixed(2)}ms)`);

//   return long_res;
// };

const memory_agent = async (msg) => {
  const start = performance.now();
  try {
    const ex_prompt = await extractor(msg);
    const ex_res = await llmRun(ex_prompt);
    if (!ex_res) return;
    console.log("✅ Received extractor details!");
  
    saveNote('gemininn_txt/data_extractor.txt', ex_res);

    const get_ses_data = await get_session_data('1001');
    if(!get_ses_data) return; 
    const ses_prompt = await session_maneger(ex_res, get_ses_data);
    const ses_res = await llmRun(ses_prompt);
    if (!ses_res) return;
    console.log("✅ Received session manager details!");
    const ses_formate = llmresposeConverter(ses_res);
    console.log("session det: \n", ses_formate);
    saveNote('gemininn_txt/session.txt', ses_res);
    await session_save(ses_formate.session_update);


    const long_prompt = await longterm_maneger(ses_res);
    const long_res = await llmRun(long_prompt);
    if (!long_res) return;
    console.log("🎯 Finished memory agent task!");
    const long_formate = llmresposeConverter(long_res);
    console.log("long det: \n", long_formate);
    await history_save(long_formate.mongodb_write.entry);

    await saveKnowledgeGraphUpdates(long_formate);

    saveNote('gemininn_txt/long.txt', long_res);

    const end = performance.now();
    const sec = ((end - start) / 1000).toFixed(2);
    console.log(`⏱ Route Manager Time: ${sec}s`);

    return long_res;
  } catch (error) {
    console.error("❌ Memory agent failed:", error.message);
    return null;
  }
};



        
 module.exports = memory_agent;   