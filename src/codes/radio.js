let selectedUser = null;
let selectedChannel = null;

// 🔄 Fetch data van je API
async function loadData() {
  const res = await fetch("/api/voice-data");
  const data = await res.json();

  renderChannels(data.channels);
}

// 📺 Render channels + users
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

// 👥 Users tonen
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

// 🚀 Move user via API
async function moveUser() {
  if (!selectedUser || !selectedChannel) {
    alert("Selecteer eerst een user en channel");
    return;
  }

  await fetch("/api/move-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId: selectedUser,
      channelId: selectedChannel
    })
  });

  loadData(); // refresh
}

// 🔁 Auto refresh
setInterval(loadData, 5000);

// eerste load
loadData();