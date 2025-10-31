chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    /^https:\/\/outlook\.[^/]+\/mail/.test(tab.url)
  ) {
    chrome.scripting.executeScript({
      target: { tabId },
      files: ["contentScript.js"],
    });
  }
});