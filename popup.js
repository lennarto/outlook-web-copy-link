function waitForElement(selector, root = document, timeoutMs = 5000) {
  return new Promise((resolve) => {
    const el = root.querySelector(selector);
    if (el) return resolve(el);

    const observer = new MutationObserver(() => {
      const found = root.querySelector(selector);
      if (found) {
        observer.disconnect();
        resolve(found);
      }
    });
    observer.observe(root, { childList: true, subtree: true });

    if (timeoutMs) {
      setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, timeoutMs);
    }
  });
}

async function injectCopyButton() {
  if (!isOutlookMailView()) return;

  // If already there, do nothing
  if (document.getElementById("outlook-copy-button")) return;

  // Wait for the toolbar to appear quickly without polling
  const actionBar = await waitForElement('div[role="toolbar"], div[aria-label*="Befehlsleiste"]', document, 4000);
  if (!actionBar) return; // give up silently if not found soon

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

function handleViewChange() {
  if (isOutlookMailView()) {
    injectCopyButton();
  } else {
    removeCopyButton();
  }
}

// Listen to DOM mutations (fallback) with minimal work
const domObserver = new MutationObserver(() => {
  // Only react when the button is missing in mail view or present in non-mail views
  const inMail = isOutlookMailView();
  const hasBtn = !!document.getElementById("outlook-copy-button");
  if ((inMail && !hasBtn) || (!inMail && hasBtn)) {
    handleViewChange();
  }
});
domObserver.observe(document.body, { childList: true, subtree: true });

// Hook into SPA navigation for instant signals
(function hookSpaNavigation(){
  const push = history.pushState;
  const replace = history.replaceState;
  function fire(){ handleViewChange(); }
  history.pushState = function(){ const r = push.apply(this, arguments); fire(); return r; };
  history.replaceState = function(){ const r = replace.apply(this, arguments); fire(); return r; };
  window.addEventListener('popstate', fire, true);
  window.addEventListener('hashchange', fire, true);
})();

// Initial run
handleViewChange();