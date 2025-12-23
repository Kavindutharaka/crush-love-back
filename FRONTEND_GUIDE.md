# 🎨 MALSARA69 Frontend Development Guide

Complete guide to building a frontend for the AI Crush Coaching System.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [API Client Setup](#api-client-setup)
3. [React Integration](#react-integration)
4. [Vue.js Integration](#vuejs-integration)
5. [Vanilla JavaScript](#vanilla-javascript)
6. [State Management](#state-management)
7. [UI Components](#ui-components)
8. [Best Practices](#best-practices)
9. [Complete Example App](#complete-example-app)

---

## 🌟 Overview

### Tech Stack Recommendations

**Recommended:**
- React + TypeScript + Axios + React Query
- Vue 3 + TypeScript + Pinia + Axios
- Next.js for SSR/SSG capabilities

**Simple Option:**
- Vanilla JavaScript + Fetch API
- No build tools required

### API Base URL

```javascript
const API_BASE_URL = 'http://localhost:3001/api';
```

---

## 🔌 API Client Setup

### Option 1: Axios (Recommended)

```bash
npm install axios
```

**api/client.js**
```javascript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 429) {
      alert('Too many requests. Please wait a moment.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

### Option 2: Fetch API (No Dependencies)

**api/client.js**
```javascript
const API_BASE_URL = 'http://localhost:3001/api';

class APIClient {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  get(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, data, options) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data, options) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export default new APIClient();
```

---

## ⚛️ React Integration

### Setup

```bash
npx create-react-app malsara69-frontend
cd malsara69-frontend
npm install axios react-query
```

### API Service Layer

**services/malsara69.js**
```javascript
import apiClient from '../api/client';

export const malsara69API = {
  // User Management
  createUser: (userData) =>
    apiClient.post('/users', userData),

  getUser: (userId) =>
    apiClient.get(`/users/${userId}`),

  updateUser: (userId, updates) =>
    apiClient.put(`/users/${userId}`, updates),

  // Crush Management
  createCrush: (crushData) =>
    apiClient.post('/crushes', crushData),

  getCrush: (crushId) =>
    apiClient.get(`/crushes/${crushId}`),

  getUserCrushes: (userId) =>
    apiClient.get(`/users/${userId}/crushes`),

  updateCrush: (crushId, updates) =>
    apiClient.put(`/crushes/${crushId}`, updates),

  deleteCrush: (crushId) =>
    apiClient.delete(`/crushes/${crushId}`),

  // AI Analysis
  analyzeSituation: (analysisData) =>
    apiClient.post('/analyze', analysisData),

  getQuickAdvice: (adviceData) =>
    apiClient.post('/quick-advice', adviceData),

  evaluateAction: (evaluationData) =>
    apiClient.post('/evaluate', evaluationData),

  detectSignals: (signalsData) =>
    apiClient.post('/detect-signals', signalsData),

  getCrushContext: (crushId, userId) =>
    apiClient.get(`/crush/${crushId}?userId=${userId}`),

  // Blueprints
  getScenarios: () =>
    apiClient.get('/scenarios'),

  getPersonalities: () =>
    apiClient.get('/personalities'),

  // System
  healthCheck: () =>
    apiClient.get('/health'),
};
```

---

### React Components

#### 1. User Registration Component

**components/UserRegistration.jsx**
```jsx
import React, { useState } from 'react';
import { malsara69API } from '../services/malsara69';

function UserRegistration({ onUserCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await malsara69API.createUser(formData);

      // Save userId to localStorage
      localStorage.setItem('userId', response.user.userId);

      // Notify parent component
      onUserCreated(response.user);

      alert('Account created successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="user-registration">
      <h2>Create Your Account</h2>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Age</label>
          <input
            type="number"
            name="age"
            min="13"
            max="120"
            value={formData.age}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}

export default UserRegistration;
```

---

#### 2. Crush Profile Component

**components/CrushProfile.jsx**
```jsx
import React, { useState } from 'react';
import { malsara69API } from '../services/malsara69';

function CrushProfile({ userId, onCrushCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    personality: '',
    relationshipStatus: '',
    interests: '',
    whereMetContext: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const crushData = {
        ...formData,
        userId,
        interests: formData.interests.split(',').map(i => i.trim()).filter(Boolean),
      };

      const response = await malsara69API.createCrush(crushData);

      // Save crushId
      localStorage.setItem('currentCrushId', response.crush.crushId);

      onCrushCreated(response.crush);

      alert(`Crush profile created for ${response.crush.name}!`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create crush profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crush-profile">
      <h2>Add Your Crush</h2>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Age</label>
          <input
            type="number"
            min="13"
            max="120"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Personality</label>
          <select
            value={formData.personality}
            onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
          >
            <option value="">Select...</option>
            <option value="introvert">Introvert</option>
            <option value="extrovert">Extrovert</option>
            <option value="analytical">Analytical</option>
            <option value="spontaneous">Spontaneous</option>
            <option value="cautious">Cautious</option>
            <option value="direct">Direct</option>
          </select>
        </div>

        <div className="form-group">
          <label>Interests (comma-separated)</label>
          <input
            type="text"
            placeholder="reading, coffee, hiking"
            value={formData.interests}
            onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Where did you meet?</label>
          <input
            type="text"
            placeholder="e.g., At university coffee shop"
            value={formData.whereMetContext}
            onChange={(e) => setFormData({ ...formData, whereMetContext: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            rows="4"
            placeholder="Initial impressions, interactions, etc."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Add Crush'}
        </button>
      </form>
    </div>
  );
}

export default CrushProfile;
```

---

#### 3. AI Analysis Component

**components/AIAnalysis.jsx**
```jsx
import React, { useState } from 'react';
import { malsara69API } from '../services/malsara69';

function AIAnalysis({ userId, crushId }) {
  const [message, setMessage] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!message.trim()) {
      alert('Please describe your situation');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await malsara69API.analyzeSituation({
        userId,
        crushId,
        message,
      });

      setAnalysis(response.result.finalRecommendation);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-analysis">
      <h2>Get AI Advice</h2>

      <div className="input-section">
        <textarea
          rows="6"
          placeholder="Describe your situation... e.g., 'She replied after 2 hours saying she was busy. Is this a good sign?'"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
        />

        <button onClick={handleAnalyze} disabled={loading || !message.trim()}>
          {loading ? 'Analyzing...' : 'Analyze Situation'}
        </button>
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {analysis && (
        <div className="analysis-result">
          <div className="scenario-badge">
            <strong>Scenario:</strong> {analysis.scenario}
          </div>

          <div className="metric">
            <strong>Interest Level:</strong> {analysis.interestLevel}
          </div>

          <div className="metric">
            <strong>Confidence:</strong> {(analysis.confidence * 100).toFixed(0)}%
          </div>

          <div className="risk-level" data-risk={analysis.riskLevel}>
            <strong>Risk Level:</strong> {analysis.riskLevel}
          </div>

          <div className="recommendation">
            <h3>Next Step</h3>
            <p>{analysis.nextStep}</p>
          </div>

          <div className="explanation">
            <h3>Explanation</h3>
            <p>{analysis.explanation}</p>
          </div>

          {analysis.warnings && (
            <div className="warnings">
              <h3>⚠️ Warnings</h3>
              <p>{analysis.warnings}</p>
            </div>
          )}

          {analysis.avoid && analysis.avoid.length > 0 && (
            <div className="avoid-list">
              <h3>Things to Avoid</h3>
              <ul>
                {analysis.avoid.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AIAnalysis;
```

---

#### 4. Crush List Component

**components/CrushList.jsx**
```jsx
import React, { useState, useEffect } from 'react';
import { malsara69API } from '../services/malsara69';

function CrushList({ userId, onSelectCrush }) {
  const [crushes, setCrushes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCrushes();
  }, [userId]);

  const loadCrushes = async () => {
    try {
      const response = await malsara69API.getUserCrushes(userId);
      setCrushes(response.crushes);
    } catch (err) {
      console.error('Failed to load crushes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (crushId) => {
    if (!confirm('Delete this crush profile?')) return;

    try {
      await malsara69API.deleteCrush(crushId);
      loadCrushes(); // Reload list
    } catch (err) {
      alert('Failed to delete crush');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="crush-list">
      <h2>Your Crushes ({crushes.length})</h2>

      {crushes.length === 0 ? (
        <p>No crushes added yet. Add one to get started!</p>
      ) : (
        <div className="crushes-grid">
          {crushes.map((crush) => (
            <div key={crush.crushId} className="crush-card">
              <h3>{crush.name}</h3>
              <p>Stage: <strong>{crush.currentStage}</strong></p>
              <p>Added: {new Date(crush.createdAt).toLocaleDateString()}</p>

              <div className="crush-actions">
                <button onClick={() => onSelectCrush(crush)}>
                  Analyze
                </button>
                <button onClick={() => handleDelete(crush.crushId)} className="danger">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CrushList;
```

---

### React Query Integration (Recommended)

**hooks/useMalsara69.js**
```javascript
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { malsara69API } from '../services/malsara69';

// Get user crushes
export function useUserCrushes(userId) {
  return useQuery(
    ['crushes', userId],
    () => malsara69API.getUserCrushes(userId),
    {
      enabled: !!userId,
      staleTime: 60000, // Cache for 1 minute
    }
  );
}

// Create crush
export function useCreateCrush() {
  const queryClient = useQueryClient();

  return useMutation(
    (crushData) => malsara69API.createCrush(crushData),
    {
      onSuccess: (data) => {
        // Invalidate crushes list
        queryClient.invalidateQueries(['crushes', data.crush.userId]);
      },
    }
  );
}

// AI Analysis
export function useAIAnalysis() {
  return useMutation(
    (analysisData) => malsara69API.analyzeSituation(analysisData)
  );
}

// Example usage in component:
// const { data: crushes, isLoading } = useUserCrushes(userId);
// const { mutate: createCrush } = useCreateCrush();
// const { mutate: analyze, data: analysis } = useAIAnalysis();
```

---

## 🟢 Vue.js Integration

### Setup

```bash
npm create vue@latest malsara69-frontend
cd malsara69-frontend
npm install axios pinia
```

### Pinia Store

**stores/malsara69.js**
```javascript
import { defineStore } from 'pinia';
import { malsara69API } from '@/services/malsara69';

export const useMalsara69Store = defineStore('malsara69', {
  state: () => ({
    userId: localStorage.getItem('userId') || null,
    currentUser: null,
    crushes: [],
    currentCrush: null,
    analysisResults: [],
    loading: false,
    error: null,
  }),

  actions: {
    async createUser(userData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await malsara69API.createUser(userData);
        this.userId = response.user.userId;
        this.currentUser = response.user;

        localStorage.setItem('userId', this.userId);

        return response.user;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to create user';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async loadCrushes() {
      if (!this.userId) return;

      this.loading = true;

      try {
        const response = await malsara69API.getUserCrushes(this.userId);
        this.crushes = response.crushes;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async createCrush(crushData) {
      this.loading = true;

      try {
        const response = await malsara69API.createCrush({
          ...crushData,
          userId: this.userId,
        });

        this.crushes.push(response.crush);
        this.currentCrush = response.crush;

        return response.crush;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async analyzeSituation(message) {
      if (!this.userId) throw new Error('User not logged in');

      this.loading = true;

      try {
        const response = await malsara69API.analyzeSituation({
          userId: this.userId,
          crushId: this.currentCrush?.crushId,
          message,
        });

        const result = {
          timestamp: new Date(),
          message,
          recommendation: response.result.finalRecommendation,
        };

        this.analysisResults.unshift(result);

        return result;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    setCurrentCrush(crush) {
      this.currentCrush = crush;
    },

    clearError() {
      this.error = null;
    },
  },
});
```

---

### Vue Component Example

**components/AIAnalysis.vue**
```vue
<template>
  <div class="ai-analysis">
    <h2>Get AI Advice</h2>

    <div v-if="store.currentCrush" class="current-crush">
      <p>Analyzing for: <strong>{{ store.currentCrush.name }}</strong></p>
    </div>

    <textarea
      v-model="message"
      rows="6"
      placeholder="Describe your situation..."
      :disabled="store.loading"
    />

    <button
      @click="handleAnalyze"
      :disabled="store.loading || !message.trim()"
    >
      {{ store.loading ? 'Analyzing...' : 'Analyze Situation' }}
    </button>

    <div v-if="store.error" class="error">
      {{ store.error }}
    </div>

    <div v-if="analysis" class="analysis-result">
      <div class="scenario-badge">
        <strong>Scenario:</strong> {{ analysis.scenario }}
      </div>

      <div class="metric">
        <strong>Interest Level:</strong> {{ analysis.interestLevel }}
      </div>

      <div class="metric">
        <strong>Confidence:</strong> {{ (analysis.confidence * 100).toFixed(0) }}%
      </div>

      <div class="recommendation">
        <h3>Next Step</h3>
        <p>{{ analysis.nextStep }}</p>
      </div>

      <div class="explanation">
        <h3>Explanation</h3>
        <p>{{ analysis.explanation }}</p>
      </div>

      <div v-if="analysis.warnings" class="warnings">
        <h3>⚠️ Warnings</h3>
        <p>{{ analysis.warnings }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMalsara69Store } from '@/stores/malsara69';

const store = useMalsara69Store();
const message = ref('');
const analysis = ref(null);

const handleAnalyze = async () => {
  try {
    const result = await store.analyzeSituation(message.value);
    analysis.value = result.recommendation;
    message.value = ''; // Clear input
  } catch (error) {
    console.error('Analysis failed:', error);
  }
};
</script>

<style scoped>
.ai-analysis {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 16px;
  font-family: inherit;
}

button {
  width: 100%;
  padding: 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.analysis-result {
  margin-top: 24px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}

.scenario-badge {
  display: inline-block;
  padding: 8px 16px;
  background: #28a745;
  color: white;
  border-radius: 4px;
  margin-bottom: 12px;
}

.error {
  padding: 12px;
  background: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  margin: 12px 0;
}

.warnings {
  margin-top: 16px;
  padding: 12px;
  background: #fff3cd;
  border-left: 4px solid #ffc107;
}
</style>
```

---

## 📦 Vanilla JavaScript

**index.html**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MALSARA69 - AI Crush Coach</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h1>MALSARA69</h1>
    <p>AI Crush Coaching System</p>

    <!-- User Registration -->
    <div id="registration-section">
      <h2>Create Account</h2>
      <form id="register-form">
        <input type="text" id="name" placeholder="Name" required>
        <input type="email" id="email" placeholder="Email">
        <input type="number" id="age" placeholder="Age" min="13" max="120">
        <select id="gender">
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <button type="submit">Create Account</button>
      </form>
    </div>

    <!-- Crush Profile -->
    <div id="crush-section" style="display: none;">
      <h2>Add Crush</h2>
      <form id="crush-form">
        <input type="text" id="crush-name" placeholder="Crush Name" required>
        <input type="number" id="crush-age" placeholder="Age">
        <textarea id="crush-notes" placeholder="Notes"></textarea>
        <button type="submit">Add Crush</button>
      </form>
    </div>

    <!-- AI Analysis -->
    <div id="analysis-section" style="display: none;">
      <h2>Get AI Advice</h2>
      <textarea id="situation" rows="6" placeholder="Describe your situation..."></textarea>
      <button id="analyze-btn">Analyze</button>

      <div id="results"></div>
    </div>
  </div>

  <script src="app.js"></script>
</body>
</html>
```

**app.js**
```javascript
const API_BASE = 'http://localhost:3001/api';
let userId = localStorage.getItem('userId');
let crushId = localStorage.getItem('crushId');

// API Helper
async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// User Registration
document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const userData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    age: parseInt(document.getElementById('age').value) || undefined,
    gender: document.getElementById('gender').value || undefined,
  };

  try {
    const response = await apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    userId = response.user.userId;
    localStorage.setItem('userId', userId);

    alert('Account created!');
    document.getElementById('registration-section').style.display = 'none';
    document.getElementById('crush-section').style.display = 'block';
  } catch (error) {
    alert(error.message);
  }
});

// Create Crush
document.getElementById('crush-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const crushData = {
    userId,
    name: document.getElementById('crush-name').value,
    age: parseInt(document.getElementById('crush-age').value) || undefined,
    notes: document.getElementById('crush-notes').value,
  };

  try {
    const response = await apiRequest('/crushes', {
      method: 'POST',
      body: JSON.stringify(crushData),
    });

    crushId = response.crush.crushId;
    localStorage.setItem('crushId', crushId);

    alert('Crush profile created!');
    document.getElementById('crush-section').style.display = 'none';
    document.getElementById('analysis-section').style.display = 'block';
  } catch (error) {
    alert(error.message);
  }
});

// AI Analysis
document.getElementById('analyze-btn').addEventListener('click', async () => {
  const message = document.getElementById('situation').value;

  if (!message.trim()) {
    alert('Please describe your situation');
    return;
  }

  try {
    const response = await apiRequest('/analyze', {
      method: 'POST',
      body: JSON.stringify({ userId, crushId, message }),
    });

    const recommendation = response.result.finalRecommendation;

    document.getElementById('results').innerHTML = `
      <div class="result-card">
        <h3>Analysis Results</h3>
        <p><strong>Scenario:</strong> ${recommendation.scenario}</p>
        <p><strong>Interest Level:</strong> ${recommendation.interestLevel}</p>
        <p><strong>Confidence:</strong> ${(recommendation.confidence * 100).toFixed(0)}%</p>
        <div class="next-step">
          <h4>Next Step</h4>
          <p>${recommendation.nextStep}</p>
        </div>
        <div class="explanation">
          <h4>Explanation</h4>
          <p>${recommendation.explanation}</p>
        </div>
      </div>
    `;

    document.getElementById('situation').value = '';
  } catch (error) {
    alert(error.message);
  }
});

// Initialize
if (userId) {
  document.getElementById('registration-section').style.display = 'none';

  if (crushId) {
    document.getElementById('analysis-section').style.display = 'block';
  } else {
    document.getElementById('crush-section').style.display = 'block';
  }
}
```

---

## 📱 State Management

### Context Pattern (React)

**context/AppContext.jsx**
```jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { malsara69API } from '../services/malsara69';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [crushes, setCrushes] = useState([]);
  const [currentCrush, setCurrentCrush] = useState(null);

  useEffect(() => {
    if (userId) {
      loadUserCrushes();
    }
  }, [userId]);

  const loadUserCrushes = async () => {
    try {
      const response = await malsara69API.getUserCrushes(userId);
      setCrushes(response.crushes);
    } catch (error) {
      console.error('Failed to load crushes:', error);
    }
  };

  const createUser = async (userData) => {
    const response = await malsara69API.createUser(userData);
    setUserId(response.user.userId);
    localStorage.setItem('userId', response.user.userId);
    return response.user;
  };

  const createCrush = async (crushData) => {
    const response = await malsara69API.createCrush({
      ...crushData,
      userId,
    });
    setCrushes([...crushes, response.crush]);
    setCurrentCrush(response.crush);
    return response.crush;
  };

  return (
    <AppContext.Provider value={{
      userId,
      crushes,
      currentCrush,
      setCurrentCrush,
      createUser,
      createCrush,
      loadUserCrushes,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
```

---

## 🎨 UI Components

### Interest Level Badge

```jsx
function InterestBadge({ level, confidence }) {
  const colors = {
    strong_interest: '#28a745',
    moderate_interest: '#ffc107',
    unclear: '#6c757d',
    likely_disinterest: '#dc3545',
  };

  return (
    <div
      className="interest-badge"
      style={{
        backgroundColor: colors[level],
        color: 'white',
        padding: '8px 16px',
        borderRadius: '20px',
        display: 'inline-block',
      }}
    >
      {level.replace(/_/g, ' ')} ({(confidence * 100).toFixed(0)}%)
    </div>
  );
}
```

### Scenario Card

```jsx
function ScenarioCard({ scenario }) {
  return (
    <div className="scenario-card">
      <h3>{scenario.label.replace(/_/g, ' ').toUpperCase()}</h3>
      <p>{scenario.description}</p>

      <div className="risk-level" data-risk={scenario.risk_level}>
        Risk: {scenario.risk_level}
      </div>

      <div className="recommendations">
        <h4>Recommended:</h4>
        <ul>
          {scenario.recommended_actions.map((action, idx) => (
            <li key={idx}>{action.replace(/_/g, ' ')}</li>
          ))}
        </ul>
      </div>

      <div className="avoid">
        <h4>Avoid:</h4>
        <ul>
          {scenario.avoid.map((item, idx) => (
            <li key={idx}>{item.replace(/_/g, ' ')}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

---

## ✅ Best Practices

### 1. Error Handling

```javascript
// Always wrap API calls in try-catch
try {
  const response = await malsara69API.analyzeSituation(data);
  // Handle success
} catch (error) {
  if (error.response?.status === 429) {
    alert('Too many requests. Please wait.');
  } else if (error.response?.status === 400) {
    alert('Invalid input: ' + error.response.data.error);
  } else {
    alert('Something went wrong. Please try again.');
  }
}
```

### 2. Loading States

```jsx
function AIAnalysisButton() {
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      // API call
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleAnalyze} disabled={loading}>
      {loading ? (
        <>
          <Spinner /> Analyzing...
        </>
      ) : (
        'Analyze Situation'
      )}
    </button>
  );
}
```

### 3. Input Validation

```javascript
function validateAnalysisInput(message) {
  if (!message || message.trim().length === 0) {
    throw new Error('Please describe your situation');
  }

  if (message.length > 5000) {
    throw new Error('Message too long (max 5000 characters)');
  }

  return true;
}
```

### 4. Caching

```javascript
// Use React Query or SWR for automatic caching
import { useQuery } from 'react-query';

function useCrushList(userId) {
  return useQuery(
    ['crushes', userId],
    () => malsara69API.getUserCrushes(userId),
    {
      staleTime: 60000, // Cache for 1 minute
      cacheTime: 300000, // Keep in cache for 5 minutes
    }
  );
}
```

### 5. Security

```javascript
// Sanitize user input before display
function sanitize(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

// Never use dangerouslySetInnerHTML with user input
<div dangerouslySetInnerHTML={{ __html: userInput }} /> // ❌ NEVER!

// Instead:
<div>{userInput}</div> // ✅ Safe
```

---

## 🚀 Complete Example App

**See `/examples/react-app` folder** (to be created separately)

Includes:
- Full authentication flow
- Dashboard with crush list
- AI analysis interface
- Profile management
- Chat-like interface
- Responsive design
- Dark mode

---

## 📚 Additional Resources

- API Reference: See `API_REFERENCE.md`
- Testing Guide: See `TESTING.md`
- User Guide: See `USER_GUIDE.md`
- Quick Start: See `QUICK_START.md`

---

## 🆘 Common Issues

**CORS Error:**
```javascript
// Backend needs CORS enabled (already done in server.js)
// If still having issues, check:
// 1. API_BASE_URL is correct
// 2. Server is running
// 3. Using correct port
```

**Rate Limiting:**
```javascript
// If hitting rate limit (429), implement request queuing:
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function retryRequest(fn, retries = 3) {
  try {
    return await fn();
  } catch (error) {
    if (error.response?.status === 429 && retries > 0) {
      await delay(2000);
      return retryRequest(fn, retries - 1);
    }
    throw error;
  }
}
```

---

**Ready to build your frontend! Start with the examples above and customize as needed.** 🎨
