import axios from 'axios';

const API = axios.create({ 
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' 
});

// Response interceptor — auto-logout on 401 (expired/invalid token)
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid — clear all auth data
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminData');
            localStorage.removeItem('userToken');
            localStorage.removeItem('userData');
            delete API.defaults.headers.common['x-auth-token'];
            // Redirect to home if not already on a login page
            if (window.location.pathname !== '/login' && 
                window.location.pathname !== '/admin/login' &&
                window.location.pathname !== '/register') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Generate or Retrieve Session ID for tracking
const getSessionId = () => {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
};

// Track Behavior Utility — enhanced with richer data
export const trackBehavior = async (eventType, data = {}) => {
    try {
        // Enrich with user info if logged in
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        const enrichedData = {
            ...data,
            ...(user?.email && { email: user.email }),
            ...(user?.name && { userName: user.name }),
            userAgent: navigator.userAgent,
            referrer: document.referrer || null,
            screenWidth: window.innerWidth,
        };

        await API.post('/behavior', {
            sessionId: getSessionId(),
            pageUrl: window.location.pathname + window.location.search,
            eventType,
            data: enrichedData,
        });
    } catch (err) {
        // Silently fail — don't block UX
    }
};

// Convenience: track page view (call on route changes)
export const trackPageView = (pageName) => {
    trackBehavior('PAGE_VIEW', { pageName, title: document.title });
    // Also fire Google Analytics if present
    if (window.gtag) {
        window.gtag('event', 'page_view', { page_path: window.location.pathname });
    }
    // Also fire Facebook Pixel if present
    if (window.fbq) {
        window.fbq('track', 'PageView');
    }
};

// Convenience: track property view
export const trackPropertyView = (propertyId, address, city) => {
    trackBehavior('PROPERTY_VIEW', { propertyId, address, city });
    if (window.fbq) {
        window.fbq('track', 'ViewContent', { content_name: address, content_category: 'property' });
    }
};

// Convenience: track listing click (from search results / listing alerts)
export const trackListingClick = (propertyId, address, source) => {
    trackBehavior('LISTING_CLICK', { propertyId, address, source });
};

// Convenience: track CTA, phone, and email clicks
export const trackCTAClick = (ctaLabel, page) => {
    trackBehavior('CTA_CLICK', { ctaLabel, page });
};
export const trackPhoneClick = (page) => {
    trackBehavior('PHONE_CLICK', { phone: '+1(773)818-0444', page });
};
export const trackEmailClick = (page) => {
    trackBehavior('EMAIL_CLICK', { email: 'AmRamz79@gmail.com', page });
};

// Track listing alert email clicks via UTM parameters
export const trackListingAlertClick = () => {
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source');
    if (utmSource === 'listing_alert') {
        trackBehavior('LISTING_ALERT_CLICK', {
            utm_source: utmSource,
            utm_medium: params.get('utm_medium'),
            utm_campaign: params.get('utm_campaign'),
            utm_content: params.get('utm_content'),
            landingPage: window.location.pathname,
        });
    }
};

// Lead Submission — enhanced with tracking
export const submitLead = async (formData) => {
    const res = await API.post('/leads', formData);
    // Track form submit event
    trackBehavior('FORM_SUBMIT', { source: formData.source, intent: formData.intent });
    // Fire conversion events
    if (window.fbq) {
        window.fbq('track', 'Lead', { content_name: formData.source });
    }
    if (window.gtag) {
        window.gtag('event', 'generate_lead', { event_category: 'lead', event_label: formData.source });
    }
    return res;
};

// Listing Alert Subscription — subscribe to daily listing emails
export const subscribeListingAlert = async (data) => {
    const res = await API.post('/listing-alerts', data);
    trackBehavior('LISTING_ALERT_SUBSCRIBE', { source: data.source });
    if (window.fbq) {
        window.fbq('track', 'Lead', { content_name: 'Listing Alert Signup' });
    }
    if (window.gtag) {
        window.gtag('event', 'generate_lead', { event_category: 'listing_alert', event_label: data.source });
    }
    return res;
};

export const getLeads = () => API.get('/leads');

// ── Saved Homes ──
export const getSavedHomes = () => API.get('/users/me').then(r => r.data.savedHomes || []);
export const saveProperty = (propertyId) => API.post(`/users/saved-homes/${propertyId}`);
export const unsaveProperty = (propertyId) => API.delete(`/users/saved-homes/${propertyId}`);

// ── Saved Searches ──
export const getSavedSearches = () => API.get('/users/me').then(r => r.data.savedSearches || []);
export const saveSearch = (name, filters) => API.post('/users/saved-searches', { name, filters });
export const deleteSavedSearch = (searchId) => API.delete(`/users/saved-searches/${searchId}`);

export default API;