const connectGraph = require("../config/neo4j");

/**
 * Save knowledge graph updates to Neo4j
 */
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

/**
 * Get all information about a specific person (crush)
 */
const getPersonInfo = async (personId) => {
  const driver = await connectGraph();
  const session = driver.session();

  try {
    const query = `
      MATCH (p:Person {id: $personId})
      OPTIONAL MATCH (p)-[r]->(target)
      RETURN p, collect({type: type(r), target: target, properties: properties(r)}) as relationships
    `;

    const result = await session.run(query, { personId });

    if (result.records.length === 0) {
      return null;
    }

    const record = result.records[0];
    return {
      person: record.get('p').properties,
      relationships: record.get('relationships')
    };
  } catch (err) {
    console.error("❌ Error retrieving person info:", err);
    return null;
  } finally {
    await session.close();
  }
};

/**
 * Get crush's preferences (what they like)
 */
const getCrushPreferences = async (crushId) => {
  const driver = await connectGraph();
  const session = driver.session();

  try {
    const query = `
      MATCH (p:Person {id: $crushId})-[r:LIKES|ENJOYS|PREFERS]->(item)
      RETURN type(r) as relationship, item, properties(r) as details
    `;

    const result = await session.run(query, { crushId });

    return result.records.map(record => ({
      type: record.get('relationship'),
      item: record.get('item').properties,
      details: record.get('details')
    }));
  } catch (err) {
    console.error("❌ Error retrieving preferences:", err);
    return [];
  } finally {
    await session.close();
  }
};

/**
 * Get emotional states and patterns
 */
const getEmotionalPatterns = async (crushId) => {
  const driver = await connectGraph();
  const session = driver.session();

  try {
    const query = `
      MATCH (p:Person {id: $crushId})-[r:FELT]->(e:Emotion)
      RETURN e.id as emotion, r.context as context, r.certainty as certainty
      ORDER BY r.timestamp DESC
      LIMIT 10
    `;

    const result = await session.run(query, { crushId });

    return result.records.map(record => ({
      emotion: record.get('emotion'),
      context: record.get('context'),
      certainty: record.get('certainty')
    }));
  } catch (err) {
    console.error("❌ Error retrieving emotional patterns:", err);
    return [];
  } finally {
    await session.close();
  }
};

/**
 * Get interaction history between user and crush
 */
const getInteractionHistory = async (userId, crushId) => {
  const driver = await connectGraph();
  const session = driver.session();

  try {
    const query = `
      MATCH (u:Person {id: $userId})-[r:INTERACTED_WITH]->(c:Person {id: $crushId})
      RETURN r
      ORDER BY r.timestamp DESC
      LIMIT 20
    `;

    const result = await session.run(query, { userId, crushId });

    return result.records.map(record => record.get('r').properties);
  } catch (err) {
    console.error("❌ Error retrieving interaction history:", err);
    return [];
  } finally {
    await session.close();
  }
};

/**
 * Detect behavioral patterns (repeated actions)
 */
const detectBehavioralPatterns = async (crushId) => {
  const driver = await connectGraph();
  const session = driver.session();

  try {
    const query = `
      MATCH (p:Person {id: $crushId})-[r]->(target)
      WITH type(r) as action, count(r) as frequency
      WHERE frequency > 1
      RETURN action, frequency
      ORDER BY frequency DESC
    `;

    const result = await session.run(query, { crushId });

    return result.records.map(record => ({
      action: record.get('action'),
      frequency: record.get('frequency').toNumber()
    }));
  } catch (err) {
    console.error("❌ Error detecting patterns:", err);
    return [];
  } finally {
    await session.close();
  }
};

/**
 * Get comprehensive context about crush for reasoning
 */
const getCrushContext = async (crushId, userId = null) => {
  try {
    const [personInfo, preferences, emotions, patterns] = await Promise.all([
      getPersonInfo(crushId),
      getCrushPreferences(crushId),
      getEmotionalPatterns(crushId),
      detectBehavioralPatterns(crushId)
    ]);

    let interactions = [];
    if (userId) {
      interactions = await getInteractionHistory(userId, crushId);
    }

    return {
      personInfo,
      preferences,
      recentEmotions: emotions,
      behavioralPatterns: patterns,
      interactionHistory: interactions
    };
  } catch (err) {
    console.error("❌ Error getting crush context:", err);
    return null;
  }
};

module.exports = {
  saveKnowledgeGraphUpdates,
  getPersonInfo,
  getCrushPreferences,
  getEmotionalPatterns,
  getInteractionHistory,
  detectBehavioralPatterns,
  getCrushContext
};
