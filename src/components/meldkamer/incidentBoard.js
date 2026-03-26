// incidentBoard.js
export const PRIORITY_COLORS = {
  1: { border: 'red', dot: 'red' },
  2: { border: 'orange', dot: 'orange' },
  3: { border: 'gray', dot: 'gray' },
};

export const STATUS_LABELS = {
  OPEN: 'Open',
  IN_PROGRESS: 'Bezig',
  CLOSED: 'Gesloten',
};

export function renderIncidentBoard(containerId, incidents, onIncidentClick) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  // Filter en sorteer
  const activeIncidents = incidents.filter(i => i.status !== 'CLOSED');
  const sortedIncidents = [...activeIncidents].sort((a, b) => (a.priority || 3) - (b.priority || 3));

  // Header
  const header = document.createElement('div');
  header.className = 'incident-header';
  header.innerHTML = `
    <span>Incidenten</span>
    <span class="badge">${activeIncidents.length}</span>
  `;
  container.appendChild(header);

  // List container
  const list = document.createElement('div');
  list.className = 'incident-list';

  if (sortedIncidents.length === 0) {
    list.innerHTML = `<div style="text-align:center; padding:2rem; color:#999;">Geen actieve incidenten</div>`;
  } else {
    sortedIncidents.forEach(inc => {
      const prio = PRIORITY_COLORS[inc.priority] || PRIORITY_COLORS[2];
      const card = document.createElement('div');
      card.className = 'incident-card';
      card.style.borderLeftColor = prio.border;
      card.onclick = () => onIncidentClick(inc);

      card.innerHTML = `
        <div class="incident-title">${inc.title}</div>
        <div class="incident-subinfo">
          <span>#${inc.incident_number}</span>
          <span>${STATUS_LABELS[inc.status] || inc.status}</span>
          ${inc.location ? `<span>📍 ${inc.location}</span>` : ''}
          ${inc.assigned_units?.length ? `<span>${inc.assigned_units.length} eenhe${inc.assigned_units.length === 1 ? 'id' : 'den'}</span>` : ''}
          ${inc.claimed_by ? `<span>👤 ${inc.claimed_by.split('@')[0]}</span>` : ''}
        </div>
      `;
      list.appendChild(card);
    });
  }

  container.appendChild(list);
}