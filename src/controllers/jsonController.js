const llmresposeConverter =(response)=>{

    const jsonString = response.replace(/```json|```/g, "").trim();
    console.log("this is formatted json: ", jsonString);
    return JSON.parse(jsonString);
};

module.exports = llmresposeConverter;