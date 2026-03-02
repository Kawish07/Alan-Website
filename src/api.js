import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Generate or Retrieve Session ID for tracking
const getSessionId = () => {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
};

// Track Behavior Utility
export const trackBehavior = async (eventType, data) => {
    try {
        await API.post('/behavior', {
            sessionId: getSessionId(),
            pageUrl: window.location.pathname,
            eventType,
            data
        });
    } catch (err) {
        console.error('Tracking failed', err);
    }
};

// Lead Submission
export const submitLead = (formData) => API.post('/leads', formData);
export const getLeads = () => API.get('/leads');

export default API;