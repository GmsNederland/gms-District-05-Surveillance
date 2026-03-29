const API_URL = "https://surviveapi-production.up.railway.app";

let selectedUser = null;
let selectedChannel = null;

const ALLOWED_CHANNEL_IDS = [
  "1073724084631904436",
  "1073724087391764531",
  "1073724090633949305",
  "1073724098695401494",
  "1073724101606252615",
  "1073724104731000852",
  "1073724107369222204",
  "1073724110309445843",
  "1073724113950085302",
  "1073724116890288278",
  "1073724119708868779",
  "1073724119708868779",
  "1073724122594545786",
  "1073724125924827256",
  "1073724128936337500",
  "1073724131964637236",
  "1073724160083243028",
  "1073724163270909972",
  "1073724167398117496",
  "1073724170057297940",
  "1073724172565499945",
  "1073724175878995988",
  "1073724178961809418",
  "1073724181830705202",
  "1073724186683510824",
  "1073724190978486322",
  "1073724192287109254",
  "1073724193935458314",
  "1073724195181170698",
  "1073724156736192543"
];

const ALLOWED_ROLES = [
  "Politie",
  "Ambulance",
  "Brandweer"
];

async function loadData() {
  try {
    const res = await fetch(`${API_URL}/api/voice-data`);
    const data = await res.json();

    renderChannels(data.channels);
  } catch (err) {
    console.error("API fout:", err);
  }
}

function renderChannels(channels) {
  const channelBox = document.getElementById("channels");
  const userBox = document.getElementById("users");

  channelBox.innerHTML = "";
  userBox.innerHTML = "";

  // ✅ filter eerst
  const filteredChannels = channels.filter(channel =>
    ALLOWED_CHANNEL_IDS.includes(channel.id)
  );

  // ✅ sorteer A → Z
  const sortedChannels = filteredChannels.sort((a, b) =>
    a.name.localeCompare(b.name, "nl", { sensitivity: "base" })
  );

  sortedChannels.forEach(channel => {
    const div = document.createElement("div");
    div.className = "channel";
    div.innerText = channel.name;

    div.addEventListener("click", () => {
      selectedChannel = channel.id;

      document.querySelectorAll(".channel").forEach(c => c.classList.remove("selected"));
      div.classList.add("selected");

      renderUsers(channel.members);
    });

    channelBox.appendChild(div);
  });
}

function renderUsers(users) {
  const userBox = document.getElementById("users");
  userBox.innerHTML = "";

  users.forEach(user => {
    const div = document.createElement("div");
    div.className = "user";

    const nameEl = document.createElement("div");
    nameEl.innerText = user.username;
    nameEl.style.fontWeight = "bold";

    const rolesEl = document.createElement("div");
    rolesEl.className = "roles";

    let filteredRoles = [];

    if (user.roles && user.roles.length > 0) {
      filteredRoles = user.roles.filter(role =>
        ALLOWED_ROLES.includes(role)
      );
    }

    // tonen
    if (filteredRoles.length > 0) {
      rolesEl.innerText = filteredRoles.join(", ");
    } else {
      rolesEl.innerText = "Geen relevante rol";
    }

    div.appendChild(nameEl);
    div.appendChild(rolesEl);

    div.addEventListener("click", () => {
      selectedUser = user.id;

      document.querySelectorAll(".user").forEach(u => u.classList.remove("selected"));
      div.classList.add("selected");
    });

    userBox.appendChild(div);
  });
}

async function moveUser() {
  if (!selectedUser || !selectedChannel) {
    alert("Selecteer eerst een gebruiker en kanaal");
    return;
  }

  try {
    await fetch(`${API_URL}/api/move-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: selectedUser,
        channelId: selectedChannel
      })
    });

    loadData();
  } catch (err) {
    console.error("Move error:", err);
  }
}

// Event listener voor knop
document.addEventListener("DOMContentLoaded", () => {
  const moveBtn = document.getElementById("moveBtn");

  if (moveBtn) {
    moveBtn.addEventListener("click", moveUser);
  } else {
    console.warn("moveBtn niet gevonden in DOM");
  }
});

// Auto refresh
setInterval(loadData, 5000);
loadData();