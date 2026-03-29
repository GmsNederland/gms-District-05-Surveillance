const API_URL = "https://fastapi-production-3485.up.railway.app";

let selectedUser = null;
let selectedChannel = null;

async function loadData() {
  const res = await fetch(`${API_URL}/api/voice-data`);
  const data = await res.json();

  renderChannels(data.channels);
}

async function moveUser() {
  if (!selectedUser || !selectedChannel) {
    alert("Selecteer user + channel");
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