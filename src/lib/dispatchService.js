/**
 * Dispatch Service - API abstraction layer
 * 
 * This module abstracts all data fetching.
 * Works in plain JavaScript (no import/export).
 */

// verwacht dat base44 al globaal bestaat (via script tag)

// === INCIDENTS ===
window.IncidentService = {
  list: (sort = '-created_date', limit = 100) => 
    base44.entities.Incident.list(sort, limit),
  
  filter: (query, sort = '-created_date', limit = 100) =>
    base44.entities.Incident.filter(query, sort, limit),
  
  create: (data) => base44.entities.Incident.create(data),
  
  update: (id, data) => base44.entities.Incident.update(id, data),
  
  delete: (id) => base44.entities.Incident.delete(id),
  
  subscribe: (callback) => base44.entities.Incident.subscribe(callback),
};

// === UNITS ===
window.UnitService = {
  list: (sort = 'callsign', limit = 100) => 
    base44.entities.Unit.list(sort, limit),
  
  filter: (query, sort = 'callsign', limit = 100) =>
    base44.entities.Unit.filter(query, sort, limit),
  
  create: (data) => base44.entities.Unit.create(data),
  
  update: (id, data) => base44.entities.Unit.update(id, data),
  
  delete: (id) => base44.entities.Unit.delete(id),
  
  subscribe: (callback) => base44.entities.Unit.subscribe(callback),
};

// === EMERGENCY CALLS ===
window.CallService = {
  list: (sort = '-created_date', limit = 50) => 
    base44.entities.EmergencyCall.list(sort, limit),
  
  filter: (query, sort = '-created_date', limit = 50) =>
    base44.entities.EmergencyCall.filter(query, sort, limit),
  
  create: (data) => base44.entities.EmergencyCall.create(data),
  
  update: (id, data) => base44.entities.EmergencyCall.update(id, data),
  
  subscribe: (callback) => base44.entities.EmergencyCall.subscribe(callback),
};

// === BROADCASTS ===
window.BroadcastService = {
  list: (sort = '-created_date', limit = 50) => 
    base44.entities.Broadcast.list(sort, limit),
  
  create: (data) => base44.entities.Broadcast.create(data),
  
  update: (id, data) => base44.entities.Broadcast.update(id, data),
  
  subscribe: (callback) => base44.entities.Broadcast.subscribe(callback),
};

// === INCIDENT NUMBER GENERATOR ===
window.generateIncidentNumber = function() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const h = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  return `INC-${y}${m}${d}-${h}${min}${s}`;
};