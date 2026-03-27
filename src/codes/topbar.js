    // Clock update
    const clockEl = document.getElementById('clock');
    setInterval(() => {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString('nl-NL', {hour: '2-digit', minute: '2-digit', second: '2-digit'});
    }, 1000);

    // Roepnummer edit
    function editRnr() {
      const span = document.getElementById('roepnummer');
      const input = document.getElementById('rnrInput');
      input.value = span.textContent === 'RNR instellen' ? '' : span.textContent;
      span.style.display = 'none';
      input.style.display = 'inline-block';
      input.focus();
      input.addEventListener('blur', saveRnr);
      input.addEventListener('keydown', e => { if(e.key==='Enter') saveRnr(); });
    }
    function saveRnr() {
      const span = document.getElementById('roepnummer');
      const input = document.getElementById('rnrInput');
      span.textContent = input.value.trim() || 'RNR instellen';
      span.style.display = 'inline-block';
      input.style.display = 'none';
    }

    // Status toggle
    function toggleStatus() {
      const menu = document.getElementById('statusMenu');
      menu.style.display = (menu.style.display==='block') ? 'none' : 'block';
    }

    function setStatus(statusText, statusClass) {
      const btn = document.getElementById('statusBtn');
      btn.innerHTML = `<div class="dot ${statusClass}"></div ${statusText}▼`;
      document.getElementById('statusMenu').style.display = 'none';
    }
