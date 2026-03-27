function openTab(id,el){
    document.querySelectorAll(".panel").forEach(p=>p.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
    el.classList.add("active");
}

/* --- Map --- */
function previewMap(e){
    let file=e.target.files[0];
    let reader=new FileReader();
    reader.onload=ev=>document.getElementById("preview").src=ev.target.result;
    reader.readAsDataURL(file);
}
function uploadMap(){alert("Kaart geüpload! Backend call hier toevoegen.");}

function deleteMap(){
    if(confirm("Weet je zeker dat je de kaart wilt verwijderen?")){
        document.getElementById("preview").src="";
        alert("Kaart verwijderd!");
    }
}

/* --- Audio --- */
function playTone(freq){
    let ctx=new AudioContext();
    let osc=ctx.createOscillator();
    osc.frequency.value=freq;
    osc.connect(ctx.destination);
    osc.start();
    setTimeout(()=>osc.stop(),200);
}

/* --- Logs --- */
let logs=["[SYSTEEM] GMS gestart","[AUTH] wachten op verbinding","[WARN] Backend niet gekoppeld"];
let box=document.getElementById("logBox");

function addLog(msg){
    let p=document.createElement("div");
    p.classList.add("logNew");
    p.textContent=msg;
    box.appendChild(p);
    box.scrollTop=box.scrollHeight;
}
logs.forEach(l=>addLog(l));

/* --- Users --- */
function addTestUser(){
    let tbody=document.getElementById("userTable");
    let tr=document.createElement("tr");
    tr.innerHTML=`<td>TestUser</td><td>Admin</td><td>Actief</td><td>Acties</td><td>Lid sinds</td><td>tijd</td>
    <td>
        <button onclick="openPopup(this)">Bewerk</button>
    </td>`;
    tbody.appendChild(tr);
}

function openPopup(userData) {
    document.getElementById("bewerkenpopup").style.display = "flex";
}

function closePopup() {
    document.getElementById("bewerkenpopup").style.display = "none";
}

/* --- Config --- */
function saveConfig(){
    let maxUsers=document.getElementById("maxUsers").value;
    let webhook=document.getElementById("discordWebhook").value;
    let botToken=document.getElementById("botToken").value;
    alert(`Config opgeslagen!\nMax Users:${maxUsers}\nWebhook:${webhook}\nBotToken:${botToken}`);
}
