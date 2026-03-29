const API_URL = "https://fastapi-production-3485.up.railway.app";

let selectedUser = null;
let selectedChannel = null;

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

  channels.forEach(channel => {
    const div = document.createElement("div");
    div.className = "channel";
    div.innerText = channel.name;

    div.onclick = () => {
      selectedChannel = channel.id;

      document.querySelectorAll(".channel").forEach(c => c.classList.remove("selected"));
      div.classList.add("selected");

      renderUsers(channel.members);
    };

    channelBox.appendChild(div);
  });
}

function renderUsers(users) {
  const userBox = document.getElementById("users");
  userBox.innerHTML = "";

  users.forEach(user => {
    const div = document.createElement("div");
    div.className = "user";
    div.innerText = user.username;

    div.onclick = () => {
      selectedUser = user.id;

      document.querySelectorAll(".user").forEach(u => u.classList.remove("selected"));
      div.classList.add("selected");
    };

    userBox.appendChild(div);
  });
}

async function moveUser() {
  if (!selectedUser || !selectedChannel) {
    alert("Selecteer eerst een gebruiker en kanaal");
    return;
  }

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
}

// auto refresh
setInterval(loadData, 5000);
loadData();