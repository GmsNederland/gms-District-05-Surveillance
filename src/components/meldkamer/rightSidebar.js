// rightSidebar.js
export class RightSidebar {
  constructor({ incidents, units, calls, broadcasts }) {
    this.incidents = incidents || [];
    this.units = units || [];
    this.calls = calls || [];
    this.broadcasts = broadcasts || [];

    // Default tab
    this.tab = 'incidents';

    // Container
    this.container = document.getElementById('right-panel');
    this.render();
    this.attachEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="tabs-list">
        <div class="tab-trigger ${this.tab === 'incidents' ? 'active' : ''}" data-tab="incidents">Incidenten</div>
        <div class="tab-trigger ${this.tab === 'units' ? 'active' : ''}" data-tab="units">Eenheden</div>
        <div class="tab-trigger ${this.tab === 'activity' ? 'active' : ''}" data-tab="activity">Log</div>
      </div>

      <div class="tab-content ${this.tab === 'incidents' ? 'active' : ''}" id="incidents">
        ${this.incidents.map(i => `<div class="panel">${i}</div>`).join('')}
      </div>

      <div class="tab-content ${this.tab === 'units' ? 'active' : ''}" id="units">
        ${this.units.map(u => `<div class="panel">${u}</div>`).join('')}
      </div>

      <div class="tab-content ${this.tab === 'activity' ? 'active' : ''}" id="activity">
        ${this.calls.map(c => `<div class="panel">${c}</div>`).join('')}
        ${this.broadcasts.map(b => `<div class="panel">${b}</div>`).join('')}
      </div>
    `;
  }

  attachEvents() {
    const triggers = this.container.querySelectorAll('.tab-trigger');
    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        this.tab = trigger.dataset.tab;
        this.render();
        this.attachEvents();
      });
    });
  }
}