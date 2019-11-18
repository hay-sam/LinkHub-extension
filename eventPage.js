chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ status: 0 }, (innerObj) => {
    chrome.storage.local.get(['status'], (storageObj) => {
      console.log('intial status is ', storageObj);
    });
  });
});
// let redirectURI = chrome.identity.getRedirectURL('success');

chrome.runtime.onMessageExternal.addListener(
  (request, sender, sendResponse) => {
    console.log(request.action);
    if (request.action ==='loggedIn') {
      chrome.storage.local.set({ user: request.userId }, (innerObj) => {
        chrome.storage.local.get(['user'], (storageObj) => {
          console.log('set user as:', storageObj);
        });
      });

    } else if (request.action === 'loggedOut') {
      chrome.storage.local.set({ user: null }, (innerObj) => {
        chrome.storage.local.get(['user'], (storageObj) => {
          console.log('user is:', storageObj);
        });
      });
    }
  });

chrome.extension.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'launchOauth') {
    console.log('oauth started');
  } else if (request.action === 'saveLink') {
    let userId;
    chrome.storage.local.get(['user'], (storageObj) => {
      console.log(storageObj.user, "userId");
      let xhr = new XMLHttpRequest();
      let reqURL = `https://link--hub.herokuapp.com/api/users/${storageObj.user}/posts`;
      console.log("reqURL", reqURL)
      xhr.open('POST', reqURL, true);
      xhr.setRequestHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin');
      xhr.setRequestHeader('Access-Control-Allow-Origin', 'https://link--hub.herokuapp.com/');

      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.withCredentials = true;
      let currentUrl;
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, async (tabs) => {
        currentUrl = await tabs[0].url;
        console.log(currentUrl);
        console.log({ url: currentUrl, tags: [] });
        xhr.send(JSON.stringify({ url: currentUrl, tags: [] }));
      });
    });
  }
}); // extension event listener
