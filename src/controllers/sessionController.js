const session = require('../models/sessionModels');

const session_save  = async (response, user_id = 1001)=>{
    console.log("llllllllllllllllllllll \n",response);
    var payload = {
        user_id: user_id,
        date: Date.now(),
        session_data: {
            current_topic: response.current_topic,
            conversation_stage:response.conversation_stage,
            active_context: JSON.stringify(response.active_context),
            immediate_next_step: response.immediate_next_step
        }
    }
    try{
        const doc = new session(payload);
        await doc.save();
    }catch(error){
        console.error("error: ",error);
    }
};

const get_session_data = async (user_id) =>{
    try{
        const session_data = await session.find({user_id: user_id});
        console.log("this is session data: ", session_data);
        return session_data;
    }catch(error){
        console.error("error: ",error);
    }
};

module.exports = {session_save, get_session_data};