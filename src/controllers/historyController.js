const history = require('../models/historyModal');

const history_save  = async (response, user_id=1001)=>{
    var payload = {
        user_id: user_id,
        date: Date.now(),
        history_data: JSON.stringify(response)
    }
    try{
        const doc = new history(payload);
        await doc.save();
    }catch(error){
        console.error("error: ",error);
    }
};

module.exports = {history_save};