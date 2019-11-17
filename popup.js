const authButton = document.getElementById('authBtn');

function authHandler() {
  chrome.extension.sendMessage({
    action: 'launchOauth'
  });
}

authButton.onclick = authHandler;

const saveButton = document.getElementById('saveBtn');

function saveHandler() {
  chrome.extension.sendMessage({
    action: 'saveLink'
  });
}

saveButton.onclick = saveHandler;
