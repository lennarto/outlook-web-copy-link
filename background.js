chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (
      changeInfo.status === "complete" &&
      tab.url &&
      tab.url.match(/^https:\/\/outlook\.[^/]+\/mail/)
    ) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["contentScript.js"]
      });
    }
  });