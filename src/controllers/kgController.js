const connectGraph = require("../config/neo4j");

const saveKnowledgeGraphUpdates = async (data) => {
    const driver = await connectGraph();
  const session = driver.session();

  try {
    const updates = data.knowledge_graph_updates || [];
    console.log("kg updates: ", updates);
    
    for (const item of updates) {
      const { 
        operation, 
        node_source, 
        node_target, 
        relationship, 
        properties 
      } = item;

      // Prepare Cypher query (MERGE is safe — it avoids duplicates)
      const query = `
        ${operation} (a:${node_source.label} {id: $sourceId})
        ${operation} (b:${node_target.label} {id: $targetId})
        ${operation} (a)-[r:${relationship}]->(b)
        SET r += $props
        RETURN a, b, r
      `;

      const params = {
        sourceId: node_source.id,
        targetId: node_target.id,
        props: properties || {}
      };

      await session.run(query, params);
    }

    console.log("✅ Knowledge graph updated successfully!");
  } catch (err) {
    console.error("❌ Error saving knowledge graph:", err);
  } finally {
    await session.close();
  }
};

module.exports = { saveKnowledgeGraphUpdates };