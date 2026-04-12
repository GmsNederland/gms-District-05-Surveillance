 // Firebase config (vul in met jouw eigen project config)
  const firebaseConfig = {
    apiKey: "AIzaSyBRZCtv2Gr145LSlZw1QHIIkKXSHZoUk-U",
    authDomain: "district05surveillance-e5183.firebaseapp.com",
    databaseURL: "https://district05surveillance-e5183-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "district05surveillance-e5183",
    storageBucket: "district05surveillance-e5183.firebasestorage.app",
    messagingSenderId: "492638820842",
    appId: "1:492638820842:web:a3ff331099f9f4e88efa93",
    measurementId: "G-4WLXZ1L4MG"
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  const auth = firebase.auth();
  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      // ❌ niet ingelogd → terug naar login
      window.location.replace("/src/index.html");
      return;
    }

    // ✅ wel ingelogd → toegang geven
    console.log("Ingelogd:", user.uid);

    document.body.style.display = "block";
  });
  // firebase.auth().onAuthStateChanged((user) => {
  //   if (user) {
  //     // ✔ gebruiker is ingelogd
  //     console.log("Ingelogd als:", user.uid);

  //     // hier kun je je meldkamer laden
  //     loadMeldkamer(user);

  //   } else {
  //     // ❌ niet ingelogd → terug naar login
  //     window.location.href = "/src/index.html";
  //   }
  // });
  const callsRef = db.ref("calls");

  // Clock
  const clock = document.getElementById('clock');
  setInterval(() => {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString('nl-NL', {hour12:false});
  }, 1000);

  // Map
  const mapWidth = 1000;
  const mapHeight = 1000;

  let liveMarkers = {};   // ✅ HIER
  let lastSeen = {};      // ✅ HIER
  let currentIncident = null;  // voor de meldingen


  const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -2
  });

  const imageUrl = "/map.png";
  const bounds = [[0, 0], [mapHeight, mapWidth]];
  L.imageOverlay(imageUrl, bounds).addTo(map);
  map.fitBounds(bounds);

  const callsList = document.getElementById('calls-list');
  const incidentList = document.getElementById('incident-list');
  const unitsList = document.getElementById('units-list');


  const markers = { units:new Map(), incidents:new Map(), calls:new Map() };

  //map funcitons
  const DEBUG = true;

  function debug(...args) {
    if (DEBUG) console.log("[MAP DEBUG]", ...args);
  }

  function toMapCoords(mapPos) {
    return [
      mapPos.y * mapHeight,
      mapPos.x * mapWidth
    ];
  }

  async function loadPlayers() {
    try {
      const res = await fetch("https://apiservi-uba4.onrender.com/player-locations");
      const raw = await res.json();

      const data = raw.players || [];
      const newUnits = [];

      if (!Array.isArray(data)) {
        console.error("API structuur fout:", raw);
        return;
      }

      const activeIds = new Set();

      data.forEach(player => {
        if (!player || !player.mapPosition) return;

        const id = player.userId;
        activeIds.add(id);

        const coords = toMapCoords(player.mapPosition);
        lastSeen[id] = Date.now();

        const serviceMap = {
          Politie: 'politie',
          Ambulance: 'ambulance',
          Brandweer: 'brandweer',
          KNRM: 'knrm'
        };

        const service = serviceMap[player.team];

        if (service) {
          newUnits.push({
            id: player.userId,
            callsign: player.roepnummer || player.username,
            service: service,
            status: 'Actief',
            operator: player.username,
            latitude: coords[0],
            longitude: coords[1],
            statusColor: 'status-enroute',
            serviceLabel: player.team
          });
        }

        if (liveMarkers[id]) {
          liveMarkers[id].setLatLng(coords);
        } else {
          const marker = L.marker(coords).addTo(map);

          // ALTijd zichtbaar (label)
          const label = `
            <div class="marker-label">
              <b>${player.username}</b><br>
              Team: ${player.team}<br>
              Roepnummer: ${player.roepnummer || "N/A"}
            </div>
          `;

          marker.bindTooltip(label, {
            permanent: true,
            direction: "top",
            offset: [0, -10],
            className: "player-tooltip"
          });

          // Klik popup (extra details)
          const popupContent = `
            <div>
              <b>${player.username}</b><br><br>
              <b>Team:</b> ${player.team}<br>
              <b>Roepnummer:</b> ${player.roepnummer || "N/A"}<br>
              <b>User ID:</b> ${player.userId}<br>
              <b>Laatste update:</b> ${new Date().toLocaleTimeString()}
            </div>
          `;

          marker.bindPopup(popupContent);

          liveMarkers[id] = marker;
        }
      });
        window.units = newUnits;
        
        const container = document.getElementById('unitsContainer');
        if (container) {
          renderUnits(container);
        }
      // cleanup
      Object.keys(liveMarkers).forEach(id => {
        if (!activeIds.has(Number(id))) {
          if (Date.now() - (lastSeen[id] || 0) > 5000) {
            map.removeLayer(liveMarkers[id]);
            delete liveMarkers[id];
            debug("Removed:", id);
          }
        }
      });

    } catch (err) {
      console.error("API fout:", err);
    }
  }

  // elke 2 seconden refresh
  setInterval(loadPlayers, 2000);

  // eerste keer direct laden
  loadPlayers();
  
  // stop map functions
  function updateCalls(calls) {
    callsList.innerHTML='';
    calls.forEach(call => {
      const div=document.createElement('div');
      div.className='call-card';
      div.innerHTML=`
        <div class="call-header">
          <span class="call-name">${call.name}</span>
          <span class="prio-badge prio-${call.prio}">PRIO ${call.prio}</span>
        </div>
        <div class="call-location">${call.location}</div>
        <div class="call-wait">Wacht: ${call.wait}</div>
        <button class="call-button" onclick="acceptCall('${call.id}')">Aannemen</button>
      `;
      callsList.appendChild(div);
    });
    document.getElementById('waiting-count').textContent=`${calls.length} wachtend`;
  }

  function updateIncidents(incidents) {
    incidentList.innerHTML='';
    incidents.forEach(inc => {
      const div=document.createElement('div');
      div.className=`incident-item incident-prio-${inc.prio}`;
      div.innerHTML=`
        <div class="incident-title">${inc.title}</div>
        <div class="incident-location">${inc.location}</div>
        <div class="incident-status">${inc.status}</div>
      `;
      incidentList.appendChild(div);

      // Marker op map
      if(!markers.incidents.has(inc.id)) {
        const color = inc.prio==1?'#e83f3f':inc.prio==2?'#f18d29':'#47b04b';
        const marker=L.circleMarker([inc.lat,inc.lng],{radius:10,color:color,weight:3,fillOpacity:0.6}).addTo(map);
        markers.incidents.set(inc.id, marker);
      }
    });
    document.getElementById('map-incidents').textContent=incidents.length;
  }

  function updateUnits(units) {
    unitsList.innerHTML='';
    units.forEach(unit => {
      const div=document.createElement('div');
      div.className='unit-item';
      div.innerHTML=`
        <div class="unit-info">
          <div class="unit-callsign">${unit.callsign}</div>
          <div class="unit-service">${unit.service}</div>
        </div>
        <div>
          <span class="unit-status status-${unit.status.toLowerCase()}">${unit.status}</span>
        </div>
      `;
      unitsList.appendChild(div);

      // Marker op map
      if(!markers.units.has(unit.id)) {
        const color = unit.status=='Available'?'#47b04b':unit.status=='Responding'?'#2376f6':'#f18d29';
        const marker=L.circleMarker([unit.lat,unit.lng],{radius:8,color:color,weight:2,fillOpacity:0.6}).addTo(map);
        markers.units.set(unit.id, marker);
      }
    });
    document.getElementById('map-units').textContent=units.length;
  }

  // Listen for realtime updates from Firebase
  db.ref('meldingen').on('value', snapshot => {
    const calls = [];
    snapshot.forEach(child => {
      calls.push({
        firebaseKey: child.key,
        ...child.val()
      });
    });
    updateCalls(calls);
  });

  db.ref('incidenten').on('value', snapshot => {
    const incidents=[];
    snapshot.forEach(child => { incidents.push(child.val()); });
    renderIncidents(incidents);
  });

  db.ref('eenheden').on('value', snapshot => {
    const units=[];
    snapshot.forEach(child => { units.push(child.val()); });
    updateUnits(units);
  });

  db.ref('calls').on('value', snap => {
    const calls = [];

    snap.forEach(child => {
      calls.push({
        firebaseKey: child.key,
        ...child.val()
      });
    });

    renderCalls(calls);
    renderIncidents(calls);
  });

//   // test geluiden
// audioManager.playIncomingCall();

// setTimeout(() => {
//   audioManager.playDispatchConfirm();
// }, 1000);

// setTimeout(() => {
//   audioManager.playAlertSiren();
// }, 2000);

// setTimeout(() => {
//   audioManager.playIncidentClosed();
// }, 3500);

  // === PRIORITY COLORS ===
  window.PRIORITY_COLORS = {
    1: { bg: 'bg-red-600', text: 'text-red-400', border: 'border-red-600', label: 'PRIO 1', dot: 'bg-red-500' },
    2: { bg: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500', label: 'PRIO 2', dot: 'bg-orange-500' },
    3: { bg: 'bg-emerald-600', text: 'text-emerald-400', border: 'border-emerald-600', label: 'PRIO 3', dot: 'bg-emerald-500' },
    4: { border: 'red', dot: 'red', label: 'PRIO 1' },
    5: { border: 'orange', dot: 'orange', label: 'PRIO 2' },
    6: { border: 'green', dot: 'green', label: 'PRIO 3' },
  };

  // === STATUS LABELS ===
  window.STATUS_LABELS = {
    NEW: 'Nieuw',
    DISPATCHED: 'Gealarmeerd',
    EN_ROUTE: 'Onderweg',
    ON_SCENE: 'Ter plaatse',
    TRANSPORT: 'Transport',
    CLOSED: 'Afgehandeld',
  };

  // === STATUS FLOW ===
  window.STATUS_FLOW = ['NEW', 'DISPATCHED', 'EN_ROUTE', 'ON_SCENE', 'TRANSPORT', 'CLOSED'];

  // === UNIT STATUS COLORS ===
  window.UNIT_STATUS_COLORS = {
    available: 'bg-emerald-500',
    responding: 'bg-blue-500',
    on_scene: 'bg-orange-500',
    busy: 'bg-red-500',
    out_of_service: 'bg-slate-500',
  };

  // === UNIT STATUS LABELS ===
  window.UNIT_STATUS_LABELS = {
    available: 'Beschikbaar',
    responding: 'Onderweg',
    on_scene: 'Ter plaatse',
    busy: 'Bezet',
    out_of_service: 'Buiten dienst',
  };

  // === SERVICE COLORS ===
  window.SERVICE_COLORS = {
    politie: 'text-blue-400',
    ambulance: 'text-yellow-400',
    brandweer: 'text-red-400',
    knrm: 'text-orange-400',
  };

  // === SERVICE LABELS ===
  window.SERVICE_LABELS = {
    politie: 'Politie',
    ambulance: 'Ambulance',
    brandweer: 'Brandweer',
    knrm: 'KNRM',
  };

  // === INCIDENT TYPES ===
  window.INCIDENT_TYPES = [
    'Brand',
    'Ongeval letsel',
    'Ongeval materieel',
    'Reanimatie',
    'Steekpartij',
    'Schietpartij',
    'Overval',
    'Inbraak',
    'Huiselijk geweld',
    'Vermissing',
    'Waterongeval',
    'Gaslek',
    'Assistentie ambulance',
    'Assistentie politie',
    'Assistentie brandweer',
    'Overlast',
    'Verdachte situatie',
    'Achtervolging',
    'Verkeerscontrole',
    'Overig',
  ];

  // === REGIONS ===
  window.REGIONS = [
    'Amsterdam-Amstelland',
    'Rotterdam-Rijnmond',
    'Den Haag',
    'Utrecht',
    'Noord-Holland-Noord',
    'Midden-Nederland',
    'Oost-Brabant',
    'Limburg-Zuid',
    'Gelderland-Zuid',
    'Alle regio\'s',
  ];
  // popup meldingen
  window.closeModal = function () {
  document.getElementById("incident-modal").style.display = "none";
  };
  window.addNote = function () {
    const text = document.getElementById("incident-note").value;
    if (!text || !currentIncident) return;

    const ref = db.ref("calls/" + currentIncident.firebaseKey);

    ref.once("value", snap => {
      const data = snap.val();
      const notes = data.notes || [];

      notes.push(text);

      ref.update({ notes });
    });

    document.getElementById("incident-note").value = "";
  };
  window.closeIncident = function () {
    if (!currentIncident) return;

    db.ref("calls/" + currentIncident.firebaseKey).remove();

    closeModal();
    currentIncident = null;
  };
  // eind popup meldingen deel
  // === MAP DEFAULT ===
  window.MAP_CENTER = [52.37, 4.89];
  window.MAP_ZOOM = 13;
  // === units screen ===
  function renderUnitPanel(units, onFocusUnit, onDispatchUnit) {
  const container = document.getElementById("units-list");
  container.innerHTML = "";

  if (units.length === 0) {
    container.innerHTML = "<p>Geen eenheden geregistreerd</p>";
    return;
  }

  const grouped = {
    politie: units.filter(u => u.service === 'politie'),
    ambulance: units.filter(u => u.service === 'ambulance'),
    brandweer: units.filter(u => u.service === 'brandweer'),
    knrm: units.filter(u => u.service === 'knrm'),
  };

  Object.entries(grouped).forEach(([service, serviceUnits]) => {
    if (serviceUnits.length === 0) return;

    const section = document.createElement("div");

    const title = document.createElement("h4");
    title.innerText = `${SERVICE_LABELS[service]} (${serviceUnits.length})`;
    section.appendChild(title);

    serviceUnits.forEach(unit => {
      const card = document.createElement("div");
      card.className = "unit-card";

      const header = document.createElement("div");
      header.className = "unit-header";
      header.innerHTML = `
        <span>${unit.callsign}</span>
        <span>${SERVICE_LABELS[unit.service]}</span>
      `;
      card.appendChild(header);

      if (unit.operator) {
        const op = document.createElement("div");
        op.innerText = unit.operator;
        card.appendChild(op);
      }

      // STATUS SELECT
      const select = document.createElement("select");
      Object.entries(UNIT_STATUS_LABELS).forEach(([key, label]) => {
        const option = document.createElement("option");
        option.value = key;
        option.text = label;
        if (unit.status === key) option.selected = true;
        select.appendChild(option);
      });

      select.onchange = async (e) => {
        await UnitService.update(unit.id, { status: e.target.value });
      };

      card.appendChild(select);

      // BUTTONS
      const actions = document.createElement("div");
      actions.className = "unit-actions";

      const btnDispatch = document.createElement("button");
      btnDispatch.innerText = "Alarm";
      btnDispatch.onclick = () => onDispatchUnit(unit);

      const btnFocus = document.createElement("button");
      btnFocus.innerText = "📍";
      btnFocus.onclick = () => onFocusUnit(unit);

      actions.appendChild(btnDispatch);
      actions.appendChild(btnFocus);

      card.appendChild(actions);

      section.appendChild(card);
    });

    container.appendChild(section);
  });
}

  // let calls = JSON.parse(localStorage.getItem("calls") || "[]");
  //  ===112 meldingen===
function renderCalls(calls) {
  callsList.innerHTML = "Nog geen Nieuwe Meldingen";

  const waiting = calls.filter(c => c.status === "waiting");

  waiting.forEach(call => {
    const div = document.createElement("div");
    div.className = "call-card";

    div.innerHTML = `
      <div>
        <b>${call.caller_id}</b>
        <span>PRIO ${call.priority}</span>
      </div>
      <div>${call.caller_location}</div>
    `;

    const btn = document.createElement("button");
    btn.innerText = "Aannemen";
    btn.onclick = () => onAcceptCall(call);

    div.appendChild(btn);
    callsList.appendChild(div);
  });
}
  
  // const calls = [
  //   { id: 2, caller_id: "Piet", caller_location: "Rotterdam", priority: 2, status: "waiting", created_date: "2026-03-23T12:05:00Z" },
  // ];

  function onAcceptCall(call) {
    db.ref("calls/" + call.firebaseKey).update({
      status: "accepted"
    });
  }

  // renderCallQueue(calls, onAcceptCall);

  // setInterval(() => {
  // // calls = JSON.parse(localStorage.getItem("calls") || "[]");
  // renderCallQueue(calls, onAcceptCall);
  // }, 2000);
  // Vul select-opties
  const typeSelect = document.getElementById("incident-type");
  INCIDENT_TYPES.forEach(t => {
    const option = document.createElement("option");
    option.value = t;
    option.innerText = t;
    typeSelect.appendChild(option);
  });

  const serviceSelect = document.getElementById("incident-service");
  Object.entries(SERVICE_LABELS).forEach(([k, v]) => {
    const option = document.createElement("option");
    option.value = k;
    option.innerText = v;
    serviceSelect.appendChild(option);
  });

  const regionSelect = document.getElementById("incident-region");
  REGIONS.filter(r => r !== "Alle regio's").forEach(r => {
    const option = document.createElement("option");
    option.value = r;
    option.innerText = r;
    regionSelect.appendChild(option);
  });

  // Formulier submit
  document.getElementById("incident-form").onsubmit = async (e) => {
    e.preventDefault();

    const form = {
      title: document.getElementById("incident-title").value,
      incident_type: document.getElementById("incident-type").value,
      priority: parseInt(document.getElementById("incident-priority").value),
      service: document.getElementById("incident-service").value,
      region: document.getElementById("incident-region").value,
      location: document.getElementById("incident-location").value,
      caller_id: document.getElementById("incident-caller").value,
      status: "NEW",
      incident_number: generateIncidentNumber(),
    };

    // maak incident aan
    const incident = await IncidentService.create(form);

    audioManager.playDispatchConfirm();

    alert("Incident aangemaakt: " + incident.incident_number);

    document.getElementById("create-incident").classList.add("hidden");
  };

  // Annuleer knop
  document.getElementById("incident-cancel").onclick = () => {
    document.getElementById("create-incident").classList.add("hidden");
  };

  // terug naar menu
  document.getElementById("terugnaarmenu").onclick = function () {
    window.location.href = "/src/pages/rolenselect.html";
  }

  // == popup nieuwe meldingen ==
  // Open popup
  function showIncidentPopup() {
    document.getElementById("create-incident").classList.remove("hidden");
  }

  // Sluit popup
  function hideIncidentPopup() {
    document.getElementById("create-incident").classList.add("hidden");
  }

  // Event listener voor de knop +Nieuw Incident
  document.getElementById("bottom-right-btn").addEventListener("click", showIncidentPopup);

  // Annuleer knop in het formulier
  document.getElementById("incident-cancel").addEventListener("click", hideIncidentPopup);

// Render functie
function renderIncidents(calls) {
    if (!Array.isArray(calls)) calls = [];

  const container = document.getElementById("incidents");
  container.innerHTML = "";

  const activeCalls = calls.filter(c => c.status === "accepted");

  if (activeCalls.length === 0) {
    container.innerHTML = "<p>Geen actieve incidenten</p>";
    return;
  }

  activeCalls.forEach(call => {

    const card = document.createElement("div");
    card.className = "call-card";

    const header = document.createElement("div");
    header.className = "call-header";
    header.innerHTML = `
      <span>INC-${call.id}</span>
      <span style="color:lime; font-size:10px;">ACTIEF</span>
    `;
    card.appendChild(header);

    const body = document.createElement("div");
    body.className = "call-body";

    const loc = document.createElement("div");
    loc.innerText = `Locatie: ${call.caller_location}`;
    body.appendChild(loc);

    if (call.description) {
      const desc = document.createElement("div");
      desc.innerText = `Info: ${call.description}`;
      body.appendChild(desc);
    }

    const time = document.createElement("div");
    time.innerText = `Gestart: ${new Date(call.created_date).toLocaleTimeString()}`;
    body.appendChild(time);

    card.appendChild(body);
    const btn = document.createElement("button");
      btn.className = "call-button";
      btn.innerText = "Bekijk melding";

      btn.onclick = () => openIncidentModal(call);

      card.appendChild(btn);

    container.appendChild(card);
  });
}
//lijsten switch
document.addEventListener('DOMContentLoaded', () => {
  const triggers = document.querySelectorAll('.tab-trigger');
  const contents = document.querySelectorAll('.tab-content');
  const loadedTabs = {}; // track welke tabs al geladen zijn
  // Dummy data: 1 unit
window.units = [
  {
    id: 1,
    callsign: 'Unit 01',
    service: 'politie',
    status: 'Vrij',
    operator: 'John Doe',
    latitude: 52.0,
    longitude: 5.1,
    statusColor: 'status-enroute',      // groen, vrij
    serviceLabel: 'Politie',
  },
];

// Callback functies voor de knoppen
window.onDispatchUnit = (unit) => {
  alert(`Dispatch Alarm naar ${unit.callsign}`);
};

window.onFocusUnit = (unit) => {
  alert(`Focus op ${unit.callsign} (lat: ${unit.latitude}, lng: ${unit.longitude})`);
};

function renderUnits(container) {
  container.innerHTML = '';

  const SERVICE_LABELS = {
    politie: 'Politie',
    ambulance: 'Ambulance',
    brandweer: 'Brandweer',
    knrm: 'KNRM'
  };

  const SERVICE_COLORS = {
    politie: 'service-politie',
    ambulance: 'service-ambulance',
    brandweer: 'service-brandweer',
    knrm: 'service-knrm'
  };

  const units = window.units || [];

  // 🔥 SAFE INCIDENT ARRAY
  const incidents = Array.isArray(window.incidents)
    ? window.incidents
    : Object.values(window.incidents || {});

  if (!units.length) {
    container.innerHTML =
      '<div style="padding:2rem;text-align:center;color:#999;">Geen eenheden geregistreerd</div>';
    return;
  }

  const grouped = {
    politie: units.filter(u => u.service === 'politie'),
    ambulance: units.filter(u => u.service === 'ambulance'),
    brandweer: units.filter(u => u.service === 'brandweer'),
    knrm: units.filter(u => u.service === 'knrm'),
  };

  Object.entries(grouped).forEach(([service, serviceUnits]) => {
    if (!serviceUnits.length) return;

    const serviceBox = document.createElement('div');
    serviceBox.className = 'units-service';

    const header = document.createElement('div');
    header.className = 'units-service-header ' + (SERVICE_COLORS[service] || '');
    header.textContent = `${SERVICE_LABELS[service]} (${serviceUnits.length})`;

    serviceBox.appendChild(header);

    serviceUnits.forEach(unit => {

      const card = document.createElement('div');
      card.className = 'units-card';

      card.innerHTML = `
        <div class="units-top">
          <div class="units-left">
            <div class="units-status ${unit.statusColor || ''}"></div>
            <span class="units-callsign">${unit.callsign}</span>
          </div>

          <div class="units-service-badge ${SERVICE_COLORS[service]}">
            ${SERVICE_LABELS[service]}
          </div>
        </div>

        <div class="units-subinfo">
          ${unit.operator ? `<span>${unit.operator}</span>` : ''}
        </div>
      `;

      // =========================
      // 🔥 INCIDENT DROPDOWN
      // =========================
      const wrapper = document.createElement('div');
      wrapper.className = 'units-button';

      const select = document.createElement('select');
      select.className = 'units-incident-select';

      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Kies een melding...';
      select.appendChild(defaultOption);

      incidents
        .filter(i => i.status !== 'CLOSED')
        .forEach(incident => {

          const assignedCount = incident.assignedUnits
            ? Object.keys(incident.assignedUnits).length
            : (incident.assignedUnit ? 1 : 0);

          const option = document.createElement('option');
          option.value = incident.firebaseKey || incident.id;

          option.textContent =
            `${incident.title || 'Incident'} (#${incident.incident_number || 'N/A'}) - ${assignedCount} units`;

          select.appendChild(option);
        });

      wrapper.appendChild(select);
      card.appendChild(wrapper);

      // =========================
      // BUTTONS
      // =========================
      const btnContainer = document.createElement('div');
      btnContainer.className = 'units-card-buttons';

      const dispatchBtn = document.createElement('div');
      dispatchBtn.className = 'units-button';
      dispatchBtn.textContent = 'Alarm';

      dispatchBtn.onclick = async () => {
        const incidentId = select.value;
        if (!incidentId) return alert('Kies eerst een melding!');

        const incident = incidents.find(i =>
          (i.firebaseKey || i.id) === incidentId
        );

        if (!incident) return alert('Incident niet gevonden');

        const key = incident.firebaseKey || incident.id;

        try {
          const ref = db.ref(`calls/${key}`);
          const snap = await ref.once('value');
          const data = snap.val() || {};

          const assignedUnits = data.assignedUnits || {};

          // 🔥 add unit
          assignedUnits[unit.id] = {
            id: unit.id,
            callsign: unit.callsign,
            service: unit.service,
            time: Date.now()
          };

          await ref.update({
            assignedUnits,
            status: 'DISPATCHED'
          });

          alert(`🚨 ${unit.callsign} gekoppeld aan incident`);
        } catch (err) {
          console.error(err);
          alert('Fout bij koppelen');
        }
      };

      const focusBtn = document.createElement('div');
      focusBtn.className = 'units-button';
      focusBtn.textContent = 'Focus';

      if (!unit.latitude || !unit.longitude) {
        focusBtn.style.opacity = '0.5';
      } else {
        focusBtn.onclick = () => window.onFocusUnit?.(unit);
      }

      btnContainer.appendChild(dispatchBtn);
      btnContainer.appendChild(focusBtn);

      card.appendChild(btnContainer);
      serviceBox.appendChild(card);
    });

    container.appendChild(serviceBox);
  });
}

// 🔹 1️⃣ Dummy data
window.systems = [
  { id: 'amberalert', name: 'Amber Alert', type: 'Melding', status: 'Actief' },
  { id: 'nlalert', name: 'NL-Alert', type: 'Melding', status: 'Standby' },
  { id: 'anpr', name: 'ANPR', type: 'Verkeer', status: 'Actief' },
  { id: 'luchtalarm', name: 'Luchtalarm', type: 'Melding', status: 'Actief' },
  { id: 'p20000', name: 'P2000', type: 'Melding', status: 'Standby' },
];

// 🔹 2️⃣ Tab-switch functionaliteit
document.querySelectorAll('.tab-trigger').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab-trigger').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const tabName = tab.getAttribute('data-tab');
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
  });
});

// 🔹 3️⃣ Functie om systemen te renderen
function renderSystems(container) {
  container.innerHTML = '';

  if (!window.systems.length) {
    container.innerHTML = '<div style="padding:2rem;text-align:center;color:#999;">Geen systemen beschikbaar</div>';
    return;
  }

  window.systems.forEach(system => {
    const card = document.createElement('div');
    card.className = 'system-card';
    card.id = `system-${system.id}`;

    card.innerHTML = `
      <div class="system-top">
        <span class="system-name">${system.name}</span>
        <span class="system-type">${system.type}</span>
        <span class="system-status ${system.status === 'Actief' ? 'status-active' : 'status-standby'}">${system.status}</span>
      </div>
      <div class="system-actions">
        <button class="btn-operate">Bedien</button>
        <button class="btn-info">Details</button>
      </div>
    `;

    // 📌 Bediening per systeem via popup
    card.querySelector('.btn-operate').onclick = () => openSystemPopup(system);

    // Info knop
    card.querySelector('.btn-info').onclick = () => alert(`Details voor ${system.name}`);

    container.appendChild(card);
  });
}

// de inhoud van de systemen
// Functie om een systeem-popup te openen
function openSystemPopup(system) {
  // Check of popup al bestaat
  let popup = document.getElementById(`popup-${system.id}`);
  if (!popup) {
    popup = document.createElement('div');
    popup.className = 'system-popup-overlay';
    popup.id = `popup-${system.id}`;

    // Begin van de popup
    popup.innerHTML = `
      <div class="system-popup">
        <div class="popup-header">
          <h2>${system.name}</h2>
          <button class="btn-close">✖</button>
        </div>
        <div class="popup-body"></div>
        <div class="popup-buttons">
          <button class="btn-send">Verstuur</button>
          <button class="btn-cancel">Annuleer</button>
        </div>
      </div>
    `;
    document.body.appendChild(popup);

    const body = popup.querySelector('.popup-body');

    // Velden per systeem
    const fields = [];
    if(system.id === 'p20000') {
      fields.push({label: 'Type eenheid', type:'select', options:['Brandweer','Ambulance']});
      fields.push({label: 'Roblox speler', type:'select', options:['-- kies speler --','Player1','Player2']});
      fields.push({label: 'Incident beschrijving', type:'textarea', placeholder:'Wat is er aan de hand?'});
    } else if(system.id === 'nlalert') {
      fields.push({label: 'Bericht', type:'textarea', placeholder:'Wat moeten mensen weten?'});
      fields.push({label: 'Locatie', type:'text', placeholder:'Straatnaam, Stad'});
      fields.push({label: 'Acties voor inwoners', type:'text', placeholder:'Bijv. Blijf binnen'});
    } else if(system.id === 'luchtalarm') {
      fields.push({label:'Palenselectie', type:'select', options:['Paal1','Paal2','Paal3','Paal4'], multiple:true});
      fields.push({label:'Alle palen af laten gaan?', type:'select', options:['Nee','Ja']});
    } else if(system.id === 'amberalert') {
      fields.push({label:'Naam van het kind', type:'text', placeholder:'Typ hier de Roblox naam'})
      fields.push({label: 'Leeftijd van het kind', type: 'text', placeholder: 'Typ hier de leeftijd van het kind'});
      fields.push({label: 'Opvallende kenmerken', type: 'text', placeholder: 'Bijv. moedervlek op arm'});
      fields.push({label: 'Laatste bekende locatie', type: 'textarea', placeholder: 'Waar is het kind voor het laatst gezien?'});
      fields.push({label: 'Datum & Tijd van verdwijning', type: 'text', placeholder: 'Bijv. 27-03-2026 15:30'});
    } else {
      fields.push({label:'Kenteken', type:'text', placeholder:'Typ hier het Kenteken'});
      fields.push({label: 'Verdachten: Naam', type:'text', placeholder:'Typ hier de roblox naam in'});
      fields.push({label:'Automerk', type:'select', options:['Audi','BMW']});
      fields.push({label:'waar voor', type:'select', options:['Openstaande boetes of verkeerszaken','Verdacht voertuig of persoon', 'Gestolen voertuig', 'Criminele of opsporingsdoeleinden', 'Verlopen APK-keuring', 'Voertuig zonder APK', 'Afgekeurde APK', ]});
      fields.push({label:'Extra info', type:'textarea', placeholder:'Typ hier extra info...'});
    }

    // Voeg velden toe
    fields.forEach(f => {
      const div = document.createElement('div');
      div.className = 'popup-field';
      div.innerHTML = `<label>${f.label}:</label>`;
      if(f.type === 'textarea') {
        div.innerHTML += `<textarea placeholder="${f.placeholder || ''}" rows="3"></textarea>`;
      } else if(f.type === 'text') {
        div.innerHTML += `<input type="text" placeholder="${f.placeholder || ''}" />`;
      } else if(f.type === 'select') {
        const multiple = f.multiple ? 'multiple' : '';
        let options = f.options.map(o => `<option value="${o}">${o}</option>`).join('');
        div.innerHTML += `<select ${multiple}>${options}</select>`;
      }
      body.appendChild(div);
    });

    // Sluitknoppen
    const closePopup = () => popup.style.display='none';
    popup.querySelector('.btn-close').onclick = closePopup;
    popup.querySelector('.btn-cancel').onclick = closePopup;
    document.addEventListener('keydown', e => { if(e.key==='Escape') closePopup(); });

    // Versturen
  popup.querySelector('.btn-send').onclick = () => {
    const inputs = popup.querySelectorAll('input, select, textarea');

    let valid = true;
    const data = {};

    inputs.forEach(f => {
      if (f.value === '' || f.value === null) valid = false;
      data[f.previousElementSibling.textContent.replace(':', '')] = f.value;
    });

    if (!valid) return alert('Vul alle velden in!');

    // ================================
    // 🧠 AUTO DETECT SYSTEM TYPE
    // ================================

    let payload = {};
    let url = "";

    // 🚨 AMBER ALERT DETECTIE
    if (data["Naam van het kind"] || data["Opvallende kenmerken"]) {

      url = "https://apiservi-uba4.onrender.com/api/amberalert";

      payload = {
        type: "amberalert",
        playerName: data["Naam van het kind"],
        age: data["Leeftijd van het kind"],
        features: data["Opvallende kenmerken"],
        location: data["Laatste bekende locatie"],
        datetime: data["Datum & Tijd van verdwijning"]
      };

    }
    // 🚨 LUCHTALARM DETECTIE
    else if (data["Alle palen af laten gaan?"] || data["Palenselectie"] || data["Mode"]) {

      url = "https://apiservi-uba4.onrender.com/api/luchtalarm";

      const mode = data["Alle palen af laten gaan?"] || data["Mode"];
      const selectie = data["Palenselectie"];

      if (mode === "Ja" || mode === "Alle palen") {
        payload.type = "all";
      } else {
        payload.type = "single";

        if (Array.isArray(selectie)) {
          payload.nummer = selectie.map(p => parseInt(p.replace("Paal", "")));
        } else {
          payload.nummer = parseInt(selectie.replace("Paal", ""));
        }
      }
    }

    // ================================
    // 📡 SEND TO API
    // ================================

    if (!url) {
      return alert("❌ Onbekend systeem");
    }

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(res => {
      alert(`🚨 Verstuurd!\n${JSON.stringify(payload, null, 2)}`);
    })
    .catch(err => {
      console.error("❌ Error:", err);
      alert("Fout bij versturen!");
    });

    popup.style.display = 'none';
  };
}

  popup.style.display = 'flex';
  popup.classList.add('show');
}

// 🔹 4️⃣ Render systemen zodra DOM geladen is

  // Functie om data te renderen, callback uit main code
  function loadTabContent(tab) {
    const container = document.getElementById(tab);
    container.innerHTML = ''; // clear previous content

    switch(tab) {
      case 'incidents':
        if(typeof renderIncidents === 'function') renderIncidents(container);
        break;
      case 'units':
        if(typeof renderUnits === 'function') renderUnits(container);
        break;
      case 'systemen':
        if(typeof renderSystems === 'function') renderSystems(container);
        break;
      default:
        container.innerHTML = '<div style="padding:1rem;color:#999;">Geen data</div>';
    }
  }

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const tab = trigger.dataset.tab;

      triggers.forEach(t => t.classList.remove('active'));
      trigger.classList.add('active');

      contents.forEach(c => c.classList.toggle('active', c.id === tab));

      if(!loadedTabs[tab]) {
        loadTabContent(tab);
        loadedTabs[tab] = true;
      }
    });
  });

  // systemen

  // Laad automatisch de actieve tab
  const activeTab = document.querySelector('.tab-trigger.active').dataset.tab;
  loadTabContent(activeTab);
});

// meldingen popup open
function openIncidentModal(call) {
  currentIncident = call;

  const modal = document.getElementById("incident-modal");
  const content = document.getElementById("modal-content");

  content.innerHTML = `
    <div><b>ID:</b> INC-${call.id}</div>
    <div><b>Locatie:</b> ${call.caller_location}</div>
    <div><b>Type:</b> ${call.priority}</div>
    <div><b>Omschrijving:</b> ${call.description || "-"}</div>
    <div><b>Status:</b> ${call.status}</div>
    <div><b>Notities:</b> ${(call.notes || []).join("<br>")}</div>
  `;

  modal.style.display = "flex";
}

function closeModal() {
  document.getElementById("incident-modal").style.display = "none";
  currentIncident = null;
}

function addNote() {
  const text = document.getElementById("incident-note").value;
  if (!text || !currentIncident) return;

  const ref = db.ref("calls/" + currentIncident.firebaseKey);

  ref.once("value", snap => {
    const data = snap.val();
    const notes = data.notes || [];

    notes.push(text);

    ref.update({ notes: notes });
  });

  document.getElementById("incident-note").value = "";
}

function closeIncident() {
  if (!currentIncident) return;
  db.ref("calls/" + currentIncident.firebaseKey).remove();
  closeModal();
}

// Initial render
renderIncidents();
