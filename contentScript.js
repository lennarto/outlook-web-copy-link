function copyModifiedUrl() {
  const currentUrl = window.location.href;
  const modifiedUrl = currentUrl.replace("/inbox/id/", "/deeplink/readconv/");
  navigator.clipboard.writeText(modifiedUrl)
    .then(() => showNotification("✅ Url copied"))
    .catch(err => showNotification("❌ Kopieren fehlgeschlagen"));
}

function showNotification(text) {
  const oldNote = document.getElementById("outlook-copy-note");
  if (oldNote) oldNote.remove();

  const note = document.createElement("div");
  note.id = "outlook-copy-note";
  note.textContent = text;
  note.style.position = "fixed";
  note.style.bottom = "20px";
  note.style.left = "50%";
  note.style.transform = "translateX(-50%)";
  note.style.background = "#e0ffe0";
  note.style.padding = "10px 20px";
  note.style.borderRadius = "8px";
  note.style.zIndex = 9999;
  note.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
  document.body.appendChild(note);

  setTimeout(() => note.remove(), 3000);
}

function injectCopyButton() {
  const interval = setInterval(() => {
    const actionBar = document.querySelector('div[role="toolbar"]') || document.querySelector('div[aria-label*="Befehlsleiste"]');
    const existingButton = document.getElementById("outlook-copy-button");

    if (actionBar && actionBar.offsetHeight > 0 && !existingButton) {
      clearInterval(interval);

      console.log("✅ Toolbar gefunden, Button wird hinzugefügt");

      const button = document.createElement("button");
      button.id = "outlook-copy-button";
      button.textContent = "🔗 Copy url";
      button.style.marginLeft = "8px";
      button.style.padding = "4px 10px";
      button.style.borderRadius = "6px";
      button.style.background = "#e0ffe0";
      button.style.border = "1px solid #ccc";
      button.style.cursor = "pointer";
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        event.preventDefault();
        copyModifiedUrl();
      });

      actionBar.insertBefore(button, actionBar.firstChild);
    }
  }, 300);
}

// DOM beobachten und regelmäßig versuchen, den Button zu injizieren
const observer = new MutationObserver(() => {
  const actionBar = document.querySelector('div[role="toolbar"]') || document.querySelector('div[aria-label*="Befehlsleiste"]');
  if (actionBar && !document.getElementById("outlook-copy-button")) {
    injectCopyButton();
  }
});
observer.observe(document.body, { childList: true, subtree: true });

console.log("📡 Outlook Copy Link ContentScript aktiv");