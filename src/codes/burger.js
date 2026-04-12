// ===============================
// 🔥 FIREBASE CALL SYSTEEM
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
  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
// Vereist: firebase is al geïnitialiseerd in je project
const callsRef = firebase.database().ref("calls");

// ===============================
// 📞 CALL VERSTUREN
// ===============================
function send() {

  const type = document.getElementById("type").value;
  const loc = document.getElementById("loc").value;

  if (!type || !loc) return;

  playTone();

  const newCall = {
    caller_id: "Burger",
    caller_location: loc,
    priority: Number(type),
    status: "waiting",
    created_date: new Date().toISOString()
  };

  // 🔥 push naar Firebase
  callsRef.push(newCall)
    .then(() => {
      // UI succes
      document.getElementById("form").style.display = "none";
      document.getElementById("success").style.display = "block";

      // optioneel reset inputs
      document.getElementById("type").value = "";
      document.getElementById("loc").value = "";
    })
    .catch((err) => {
      console.error("Firebase error:", err);
      alert("❌ Kon melding niet verzenden!");
    });
}

// ===============================
// 🔄 RESET UI
// ===============================
function reset() {
  document.getElementById("form").style.display = "block";
  document.getElementById("success").style.display = "none";
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

// ===============================
// 🔁 RESET CALL UI
// ===============================
function resetCall() {
  document.getElementById("formPanel").style.display = "block";
  document.getElementById("successPanel").style.display = "none";

  document.getElementById("submitBtn").disabled = false;
  document.getElementById("submitBtn").innerText = "Noodoproep Versturen";
}