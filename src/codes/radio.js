const API_URL = "https://surviveapi-production.up.railway.app";

let selectedUsers = [];
let selectedChannel = null;

let channelSearchTerm = "";
let userSearchTerm = "";

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

    // onthoud huidige selectie
    const prevSelectedChannel = selectedChannel;
    const prevSelectedUser = selectedUser;

    renderChannels(data.channels);

    // herstel selectie
    if (prevSelectedChannel) {
      const channelEl = [...document.querySelectorAll(".channel")]
        .find(el => el.innerText === data.channels.find(c => c.id === prevSelectedChannel)?.name);

      if (channelEl) channelEl.classList.add("selected");
    }

  } catch (err) {
    console.error("API fout:", err);
  }
}

function renderChannels(channels) {
  const channelBox = document.getElementById("channels");

  channelBox.innerHTML = "";

  const filteredChannels = channels
    .filter(channel => ALLOWED_CHANNEL_IDS.includes(channel.id))
    .filter(channel =>
      channel.name.toLowerCase().includes(channelSearchTerm)
    )
    .sort((a, b) =>
      a.name.localeCompare(b.name, "nl", { sensitivity: "base" })
    );

  filteredChannels.forEach(channel => {
    const div = document.createElement("div");
    div.className = "channel";
    div.innerText = channel.name;

    if (selectedChannel === channel.id) {
      div.classList.add("selected");
      renderUsers(channel.members); // 🔥 blijft zichtbaar bij refresh
    }

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

  const ROLE_PRIORITY = ["Politie", "Ambulance", "Brandweer"];

  const relevantUsers = users
    .filter(user =>
      user.roles &&
      user.roles.some(role => ROLE_PRIORITY.includes(role))
    )
    .filter(user =>
      user.username.toLowerCase().includes(userSearchTerm)
    )
    .sort((a, b) => {
      const aRole = a.roles.find(r => ROLE_PRIORITY.includes(r)) || "";
      const bRole = b.roles.find(r => ROLE_PRIORITY.includes(r)) || "";

      return ROLE_PRIORITY.indexOf(aRole) - ROLE_PRIORITY.indexOf(bRole);
    });

  relevantUsers.forEach(user => {
    const div = document.createElement("div");
    div.className = "user";

    const nameEl = document.createElement("div");
    nameEl.innerText = user.username;
    nameEl.style.fontWeight = "bold";

    const badgeContainer = document.createElement("div");
    badgeContainer.className = "badge-container";

    const filteredRoles = user.roles.filter(role =>
      ROLE_PRIORITY.includes(role)
    );

    filteredRoles.forEach(role => {
      const badge = document.createElement("span");
      badge.className = "role-badge";
      badge.innerText = role;

      if (role === "Politie") badge.classList.add("badge-police");
      if (role === "Ambulance") badge.classList.add("badge-ambulance");
      if (role === "Brandweer") badge.classList.add("badge-fire");

      badgeContainer.appendChild(badge);
    });

    div.appendChild(nameEl);
    div.appendChild(badgeContainer);

    if (selectedUser === user.id) {
      div.classList.add("selected");
    }

    div.addEventListener("click", (e) => {
    const isCtrl = e.ctrlKey || e.metaKey; // Ctrl (Windows) / Cmd (Mac)

    if (isCtrl) {
        // multi-select toggle
        if (selectedUsers.includes(user.id)) {
        selectedUsers = selectedUsers.filter(id => id !== user.id);
        div.classList.remove("selected");
        } else {
        selectedUsers.push(user.id);
        div.classList.add("selected");
        }
    } else {
        // single select (reset)
        selectedUsers = [user.id];

        document.querySelectorAll(".user").forEach(u => u.classList.remove("selected"));
        div.classList.add("selected");
    }
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

document.addEventListener("DOMContentLoaded", () => {
  const channelInput = document.getElementById("channel-search");
  const userInput = document.getElementById("user-search");

  if (channelInput) {
    channelInput.addEventListener("input", (e) => {
      channelSearchTerm = e.target.value.toLowerCase();
      loadData();
    });
  }

  if (userInput) {
    userInput.addEventListener("input", (e) => {
      userSearchTerm = e.target.value.toLowerCase();
      loadData();
    });
  }
});

// Auto refresh
setInterval(loadData, 5000);
loadData();