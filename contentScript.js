function transformOutlookUrl(url) {
  // support both variants seen in your codebase
  return url
    .replace("/inbox/id/", "/deeplink/readconv/")
    .replace("/mail/id/", "/mail/deeplink/readconv/");
}

function copyModifiedUrl() {
  const modifiedUrl = transformOutlookUrl(window.location.href);
  navigator.clipboard.writeText(modifiedUrl)
    .then(() => showNotification("✅ Url copied"))
    .catch(() => showNotification("❌ Kopieren fehlgeschlagen"));
}

function showNotification(text) {
  const old = document.getElementById("outlook-copy-note");
  if (old) old.remove();

  const note = document.createElement("div");
  note.id = "outlook-copy-note";
  note.textContent = text;
  Object.assign(note.style, {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#e0ffe0",
    padding: "10px 20px",
    borderRadius: "8px",
    zIndex: 9999,
    boxShadow: "0 2px 10px rgba(0,0,0,.2)",
  });
  document.body.appendChild(note);
  setTimeout(() => note.remove(), 3000);
}

// SPA guards: only show button in Mail view (not Calendar)
function isOutlookMailView() {
  const href = window.location.href;
  return href.includes("/mail/") && !href.includes("/calendar/");
}

function removeCopyButton() {
  const btn = document.getElementById("outlook-copy-button");
  if (btn) btn.remove();
}

function injectCopyButton() {
  if (!isOutlookMailView()) return;

  const interval = setInterval(() => {
    const actionBar =
      document.querySelector('div[role="toolbar"]') ||
      document.querySelector('div[aria-label*="Befehlsleiste"]');
    const existing = document.getElementById("outlook-copy-button");

    if (actionBar && actionBar.offsetHeight > 0 && !existing) {
      clearInterval(interval);

      const button = document.createElement("button");
      button.id = "outlook-copy-button";
      button.textContent = "🔗 Copy url";
      Object.assign(button.style, {
        marginLeft: "8px",
        padding: "2px 10px",
        borderRadius: "6px",
        background: "#e0ffe0",
        border: "1px solid #ccc",
        cursor: "pointer",
      });
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        copyModifiedUrl();
      });

      actionBar.insertBefore(button, actionBar.firstChild);
    }
  }, 300);
}

const observer = new MutationObserver(() => {
  if (isOutlookMailView()) {
    if (!document.getElementById("outlook-copy-button")) injectCopyButton();
  } else {
    removeCopyButton();
  }
});
observer.observe(document.body, { childList: true, subtree: true });

if (isOutlookMailView()) injectCopyButton();

console.log("📡 Outlook Copy Link ContentScript – SPA aware");