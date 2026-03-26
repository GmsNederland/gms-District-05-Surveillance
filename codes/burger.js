function send(){

  let type = document.getElementById("type").value;
  let loc = document.getElementById("loc").value;

  if(!type || !loc) return;

  playTone();

  document.getElementById("form").style.display="none";
  document.getElementById("success").style.display="block";

}

function reset(){

  document.getElementById("form").style.display="block";
  document.getElementById("success").style.display="none";

}

function playTone(){

  let ctx = new AudioContext();
  let osc = ctx.createOscillator();

  osc.frequency.value = 900;
  osc.connect(ctx.destination);
  osc.start();

  setTimeout(()=>osc.stop(),300);

}

function resetCall(){

document.getElementById("formPanel").style.display="block"
document.getElementById("successPanel").style.display="none"

document.getElementById("submitBtn").disabled=false
document.getElementById("submitBtn").innerText="Noodoproep Versturen"

}

