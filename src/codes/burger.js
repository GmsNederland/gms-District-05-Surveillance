// ===============================
// 🔥 FIREBASE INIT (SAFE)
// ===============================

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

// 🔥 INIT ONLY ONCE
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();
const callsRef = db.ref("calls");

// ===============================
// 🚀 DOM READY
// ===============================
document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("submitBtn");

  if (!btn) return;

  btn.addEventListener("click", sendCall);

});

// ===============================
// 📞 SEND CALL
// ===============================
async function sendCall() {

  const typeEl = document.getElementById("type");
  const locationEl = document.getElementById("location");
  const phoneEl = document.getElementById("phone");
  const descEl = document.getElementById("desc");
  const btn = document.getElementById("submitBtn");

  if (!typeEl || !locationEl || !btn) return;

  const type = typeEl.value;
  const location = locationEl.value;
  const phone = phoneEl?.value || "";
  const desc = descEl?.value || "";

  if (!type || !location) {
    alert("Vul alle verplichte velden in!");
    return;
  }

  // 🔒 prevent double click
  if (btn.disabled) return;

  btn.disabled = true;
  btn.innerText = "Versturen...";

  playTone();

  const newCall = {
    caller_id: phone || "Anoniem",
    caller_location: location,
    description: desc,
    priority: type,
    status: "waiting",
    created_date: new Date().toISOString()
  };

  try {
    await callsRef.push(newCall);

    const form = document.getElementById("formPanel");
    const success = document.getElementById("successPanel");
    const summary = document.getElementById("summary");

    if (form) form.style.display = "none";
    if (success) success.style.display = "block";
    if (summary) summary.innerText = `${type} — ${location}`;

  } catch (err) {
    console.error("Firebase error:", err);
    alert("❌ Kon melding niet verzenden!");

    btn.disabled = false;
    btn.innerText = "Noodoproep Versturen";
  }
}

// ===============================
// 🔁 RESET
// ===============================
function resetCall() {

  const form = document.getElementById("formPanel");
  const success = document.getElementById("successPanel");
  const btn = document.getElementById("submitBtn");

  if (form) form.style.display = "block";
  if (success) success.style.display = "none";

  if (btn) {
    btn.disabled = false;
    btn.innerText = "Noodoproep Versturen";
  }

  const fields = ["type", "location", "phone", "desc"];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}

// ===============================
// 🔊 SOUND
// ===============================
function playTone() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();

    osc.frequency.value = 900;
    osc.connect(ctx.destination);
    osc.start();

    setTimeout(() => osc.stop(), 300);
  } catch (e) {
    console.warn("Audio not supported");
  }
}