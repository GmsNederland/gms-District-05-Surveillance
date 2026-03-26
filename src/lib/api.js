/**
 * API Service Layer — District 05 Surveillance
 * 
 * Central API module for all backend communication.
 * Designed to be easily swapped with Firebase, custom REST, or Roblox endpoints.
 * 
 * Each function is clearly marked with FIREBASE INTEGRATION POINT comments
 * for future migration.
 */

// FIREBASE INTEGRATION POINT — Replace with Firebase config
const API_BASE_URL = '/api';

/**
 * Generic fetch wrapper with auth headers
 */
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('d05_auth_token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  // FIREBASE INTEGRATION POINT — Replace with Firebase SDK calls
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `API Error: ${response.status}`);
  }
  
  return response.json();
}

// ==========================================
// AUTH
// ==========================================

/** POST /api/login — Authenticate user */
// FIREBASE INTEGRATION POINT — Replace with firebase.auth().signInWithEmailAndPassword()
export async function loginUser(credentials) {
  return apiRequest('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

/** GET /api/me — Get current user profile + roles */
// FIREBASE INTEGRATION POINT — Replace with firebase.auth().currentUser + Firestore user doc
export async function getCurrentUser() {
  return apiRequest('/me');
}

/** POST /api/logout */
// FIREBASE INTEGRATION POINT — Replace with firebase.auth().signOut()
export async function logoutUser() {
  localStorage.removeItem('d05_auth_token');
  return apiRequest('/logout', { method: 'POST' });
}

// ==========================================
// INCIDENTS
// ==========================================

/** GET /api/incidents — List all active incidents */
// FIREBASE INTEGRATION POINT — Replace with Firestore collection listener
export async function getIncidents(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  return apiRequest(`/incidents?${params}`);
}

/** POST /api/incidents — Create new incident */
// FIREBASE INTEGRATION POINT — Replace with Firestore add()
export async function createIncident(data) {
  return apiRequest('/incidents', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/** PATCH /api/incidents/:id — Update incident */
// FIREBASE INTEGRATION POINT — Replace with Firestore update()
export async function updateIncident(id, data) {
  return apiRequest(`/incidents/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// ==========================================
// UNITS
// ==========================================

/** GET /api/units — List all units */
// FIREBASE INTEGRATION POINT — Replace with Firestore realtime listener
export async function getUnits(service) {
  const params = service ? `?service=${service}` : '';
  return apiRequest(`/units${params}`);
}

/** PATCH /api/units/:id/status — Update unit status */
// FIREBASE INTEGRATION POINT — Replace with Firestore update()
export async function updateUnitStatus(id, status) {
  return apiRequest(`/units/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

// ==========================================
// PLAYERS / BURGER DATABASE
// ==========================================

/** GET /api/players/search — Search player database */
// FIREBASE INTEGRATION POINT — Replace with Firestore query
export async function searchPlayers(query) {
  return apiRequest(`/players/search?q=${encodeURIComponent(query)}`);
}

/** GET /api/players/:id — Get player details */
// FIREBASE INTEGRATION POINT — Replace with Firestore doc get
export async function getPlayerDetails(id) {
  return apiRequest(`/players/${id}`);
}

// ==========================================
// NOTES
// ==========================================

/** GET /api/notes — Get notes for service */
// FIREBASE INTEGRATION POINT — Replace with Firestore collection
export async function getNotes(service, playerId) {
  const params = new URLSearchParams({ service, ...(playerId ? { playerId } : {}) }).toString();
  return apiRequest(`/notes?${params}`);
}

/** POST /api/notes — Create note */
// FIREBASE INTEGRATION POINT — Replace with Firestore add()
export async function createNote(data) {
  return apiRequest('/notes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ==========================================
// ADMIN
// ==========================================

/** GET /api/admin/users — List all users */
// FIREBASE INTEGRATION POINT — Replace with Firestore admin collection
export async function getAdminUsers() {
  return apiRequest('/admin/users');
}

/** PATCH /api/admin/users/:id/roles — Update user roles */
// FIREBASE INTEGRATION POINT — Replace with Firestore update + custom claims
export async function updateUserRoles(id, roles) {
  return apiRequest(`/admin/users/${id}/roles`, {
    method: 'PATCH',
    body: JSON.stringify({ roles }),
  });
}

/** GET /api/admin/logs — Get system logs */
// FIREBASE INTEGRATION POINT — Replace with Firestore logs collection
export async function getAdminLogs(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  return apiRequest(`/admin/logs?${params}`);
}

/** POST /api/admin/map — Upload map image */
// FIREBASE INTEGRATION POINT — Replace with Firebase Storage upload
export async function uploadMap(file) {
  const formData = new FormData();
  formData.append('map', file);
  return apiRequest('/admin/map', {
    method: 'POST',
    headers: {}, // Let browser set content-type for FormData
    body: formData,
  });
}

// ==========================================
// MAP
// ==========================================

/** GET /api/map — Get current map image URL */
// FIREBASE INTEGRATION POINT — Replace with Firebase Storage getDownloadURL
export async function getMapUrl() {
  return apiRequest('/map');
}

// ==========================================
// 112 CALLS (Burger)
// ==========================================

/** POST /api/calls/112 — Submit 112 emergency call */
// FIREBASE INTEGRATION POINT — Replace with Firestore add() to calls collection
export async function submit112Call(data) {
  return apiRequest('/calls/112', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/** GET /api/calls/112/status — Get call status for burger */
// FIREBASE INTEGRATION POINT — Replace with Firestore realtime listener
export async function get112CallStatus(callId) {
  return apiRequest(`/calls/112/${callId}/status`);
}