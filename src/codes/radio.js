const API_URL = "https://surviveapi-production.up.railway.app";

let selectedUser = null;
let selectedChannel = null;

const ALLOWED_CHANNEL_IDS = [
  "1073724084631904436",
  "1073724087391764531"
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

  // ✅ filter hier
  const filteredChannels = channels.filter(channel =>
    ALLOWED_CHANNEL_IDS.includes(channel.id)
  );

  filteredChannels.forEach(channel => {
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

    // naam
    const nameEl = document.createElement("div");
    nameEl.innerText = user.username;
    nameEl.style.fontWeight = "bold";

    // rollen
    const rolesEl = document.createElement("div");
    rolesEl.className = "roles";

    if (user.roles && user.roles.length > 0) {
      rolesEl.innerText = user.roles.join(", ");
    } else {
      rolesEl.innerText = "Geen rol";
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