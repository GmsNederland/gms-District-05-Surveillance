// admin.js
document.addEventListener("DOMContentLoaded", () => {

    /* ---------------- Tabs ---------------- */
    function openTab(id, el) {
        document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
        document.getElementById(id).classList.add("active");
        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        el.classList.add("active");
    }
    window.openTab = openTab; // optioneel voor inline gebruik

    /* ---------------- Map ---------------- */
    const preview = document.getElementById("preview");

    function previewMap(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => preview.src = ev.target.result;
        reader.readAsDataURL(file);
    }

    function uploadMap() {
        alert("Kaart geüpload! Backend call hier toevoegen.");
        // TODO: Voeg hier fetch/axios call naar backend toe
    }

    function deleteMap() {
        if (confirm("Weet je zeker dat je de kaart wilt verwijderen?")) {
            preview.src = "";
            alert("Kaart verwijderd!");
        }
    }

    document.getElementById("mapInput")?.addEventListener("change", previewMap);
    document.getElementById("uploadMapBtn")?.addEventListener("click", uploadMap);
    document.getElementById("deleteMapBtn")?.addEventListener("click", deleteMap);

    /* ---------------- Audio ---------------- */
    function playTone(freq) {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        osc.frequency.value = freq;
        osc.connect(ctx.destination);
        osc.start();
        setTimeout(() => osc.stop(), 200);
    }
    window.playTone = playTone;

    /* ---------------- Logs ---------------- */
    const box = document.getElementById("logBox");

    function addLog(msg) {
        const p = document.createElement("div");
        p.classList.add("logNew");
        p.textContent = msg;
        box.appendChild(p);
        box.scrollTop = box.scrollHeight;
    }

    const logs = [
        "[SYSTEEM] GMS gestart",
        "[AUTH] wachten op verbinding",
        "[WARN] Backend niet gekoppeld"
    ];
    logs.forEach(l => addLog(l));

    window.addLog = addLog;

    /* ---------------- Users ---------------- */
    function addTestUser() {
        const tbody = document.getElementById("userTable");
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>TestUser</td>
            <td>Admin</td>
            <td>Actief</td>
            <td>Lid sinds</td>
            <td>Tijd</td>
            <td><button class="editBtn">Bewerk</button></td>
        `;

        tbody.appendChild(tr);

        // Voeg event listener toe aan de knop
        tr.querySelector(".editBtn").addEventListener("click", () => {
            openPopup(tr);
        });
    }

    window.addTestUser = addTestUser;

    function openPopup(userData) {
        document.getElementById("bewerkenpopup").style.display = "flex";
        // TODO: vul popup met userData
    }

    function closePopup() {
        document.getElementById("bewerkenpopup").style.display = "none";
    }

    document.getElementById("popupCloseBtn")?.addEventListener("click", closePopup);

    window.openPopup = openPopup;
    window.closePopup = closePopup;

    /* ---------------- Config ---------------- */
    function saveConfig() {
        const maxUsers = document.getElementById("maxUsers").value;
        const webhook = document.getElementById("discordWebhook").value;
        const botToken = document.getElementById("botToken").value;

        alert(`Config opgeslagen!\nMax Users: ${maxUsers}\nWebhook: ${webhook}\nBotToken: ${botToken}`);

        // TODO: voeg hier echte backend save call toe
    }

    document.getElementById("saveConfigBtn")?.addEventListener("click", saveConfig);
    window.saveConfig = saveConfig;
});