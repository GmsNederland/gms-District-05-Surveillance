// ===============================
// 🔥 FIREBASE INIT
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

// 🔥 voorkomt dubbele init errors
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();
const callsRef = db.ref("calls");

// ===============================
// 🚀 START ALS DOM GELADEN IS
// ===============================
document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("submitBtn");

  if (btn) {
    btn.onclick = sendCall;
  }

});

// ===============================
// 📞 CALL VERSTUREN
// ===============================
async function sendCall() {

  const type = document.getElementById("type").value;
  const location = document.getElementById("location").value;
  const phone = document.getElementById("phone").value;
  const desc = document.getElementById("desc").value;

  if (!type || !location) return;

  const btn = document.getElementById("submitBtn");
  btn.innerText = "Versturen...";
  btn.disabled = true;

  playTone();

  const newCall = {
    caller_id: phone || "Anoniem",
    caller_location: location,
    description: desc || "",
    priority: type,
    status: "waiting",
    created_date: new Date().toISOString()
  };

  try {
    await callsRef.push(newCall);

    // ✅ UI succes
    document.getElementById("formPanel").style.display = "none";
    document.getElementById("successPanel").style.display = "block";

    document.getElementById("summary").innerText = `${type} — ${location}`;

  } catch (err) {
    console.error("Firebase error:", err);
    alert("❌ Kon melding niet verzenden!");

    btn.disabled = false;
    btn.innerText = "Noodoproep Versturen";
  }
}

// ===============================
// 🔁 RESET UI
// ===============================
function resetCall() {
  document.getElementById("formPanel").style.display = "block";
  document.getElementById("successPanel").style.display = "none";

  const btn = document.getElementById("submitBtn");
  btn.disabled = false;
  btn.innerText = "Noodoproep Versturen";

  document.getElementById("type").value = "";
  document.getElementById("location").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("desc").value = "";
}

// ===============================
// 🔊 PIEP GELUID
// ===============================
function playTone() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();

  osc.frequency.value = 900;
  osc.connect(ctx.destination);
  osc.start();

  setTimeout(() => osc.stop(), 300);
}