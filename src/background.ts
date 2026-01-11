chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "fetchQuote") {
    fetch(request.url)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch");
        return response.json();
      })
      .then((data) => sendResponse({ success: true, data }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true;
  }
});
