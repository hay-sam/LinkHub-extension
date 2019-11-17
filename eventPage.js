chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ status: 0 }, (innerObj) => {
    chrome.storage.local.get(['status'], (storageObj) => {
      console.log('intial status is ', storageObj);
    });
  });
});

chrome.extension.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'launchOauth') {
    console.log('oauth started');

  } else if (request.action === 'saveLink') {

      let xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost:8080/api/users/3/posts', true);
      xhr.setRequestHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin');
      xhr.setRequestHeader('Access-Control-Allow-Origin', 'http://localhost:8080/');

      xhr.setRequestHeader('Content-Type', 'application/json');
      let currentUrl;
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, async (tabs) => {
        currentUrl = await tabs[0].url;
        console.log(currentUrl);
        console.log({ url: currentUrl, tags: [] });
      xhr.send(JSON.stringify({ url: currentUrl, tags: [] }));
      });

  }
}); // extension event listener
