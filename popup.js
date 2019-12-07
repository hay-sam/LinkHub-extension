/* global chrome */
const saveBtn = document.getElementById('saveBtn');
const pageSavedMessage = document.getElementById('page-saved-message')
const loginForm = document.getElementById('auth-form')
const userName = document.getElementById('username')
const password = document.getElementById('password')
const loginErrorMessage = document.getElementById('login-error-message')
const loginInfo = document.getElementById('login-info')





checkLoginStatus()
let currentUrl
chrome.tabs.query({active: true, currentWindow: true}, tabs => {
  currentUrl = tabs[0].url
})

saveBtn.addEventListener('click', function(event) {
  event.preventDefault()
  fetch('http://localhost:8080/auth/me', {
    method: 'GET',
    mode: 'cors',
    credentials: 'include'
  }).then(res =>
    res.json().then(user =>
      fetch(`http://localhost:8080/api/users/${user.id}/posts`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url : currentUrl,
          tags: []
        })
      })
    )
  )
  saveBtn.disabled = true;
  saveBtn.innerHTML = `<span>Saved to LinkHub</span>`
})

loginForm.addEventListener('submit', function(event) {
  event.preventDefault()
  fetch('http://localhost:8080/auth/login', {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: userName.value,
      password: password.value
    })
  })
    .then(response => {
      if (response.status === 401) {
        loginErrorMessage.innerText = 'wrong username and/or password'
      } else {
        checkLoginStatus()
      }
    })
    .catch(error => {
      loginErrorMessage.innerText = 'Login request failed: ' + error
    })
  loginForm.reset()
})

async function checkLoginStatus() {
  try{
    let response = await fetch('http://localhost:8080/auth/me', {
    method: 'GET',
    mode: 'cors',
    credentials: 'include'
  })
  if (response.status === 200) {
      const logoutButton = document.createElement('button')
      logoutButton.innerText = 'Logout'
      logoutButton.onclick = async function() {
        try{
          await fetch('http://localhost:8080/auth/logout', {
          method: 'POST',
          mode: 'cors',
          credentials: 'include'
        })
        location.reload()
        }catch(error){
          console.error(error)
        }
      }//end logout function
      loginInfo.appendChild(logoutButton)
      loginForm.style.display = "none"
      saveBtn.style.display = "block"
    }
  }

    catch(error){
      console.error(error)
    }
}
