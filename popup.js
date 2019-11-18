
const saveButton = document.getElementById('saveBtn');

function saveHandler() {
  chrome.extension.sendMessage({
    action: 'saveLink'
  });
}

saveButton.onclick = saveHandler;
