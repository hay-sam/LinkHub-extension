/* global chrome */
const saveBtn = document.getElementById('saveBtn');
const saveForm = document.getElementById('save');
const tags = document.getElementById('tags')
const googleBtn = document.getElementById('google');
const loginForm = document.getElementById('auth-form')
const userName = document.getElementById('email')
const password = document.getElementById('password')
const loginErrorMessage = document.getElementById('login-error-message')
const loginInfo = document.getElementById('login-info')
const title = document.getElementById("title")

// Route to LinkHub to view saved Links
title.addEventListener('click', function (event){
  chrome.tabs.create({ url: "https://link--hub.herokuapp.com/" })
})



// Make sure the correct components are being rendered
// Show Login if not logged in / Post Saving if logged in
checkLoginStatus()

let currentUrl
chrome.tabs.query({active: true, currentWindow: true}, tabs => {
  currentUrl = tabs[0].url
})

// Authenticate with server through oauth
googleBtn.addEventListener('click', function (event){
  chrome.tabs.create({ url: "https://link--hub.herokuapp.com/auth/google" })
})

// Save Link
saveForm.addEventListener('submit', function(event) {
  event.preventDefault()
  let postTags
  if(!!tags.value.length){
    postTags = tags.value.split(',').map(tag=>tag.trim())
  }else{
    postTags = []
  }
  fetch('https://link--hub.herokuapp.com/auth/me', { // Authenticate with server
    method: 'GET',
    mode: 'cors',
    credentials: 'include'
  }).then(res =>
    res.json().then(user =>
      fetch(`https://link--hub.herokuapp.com/api/users/${user.id}/posts`, { // Save Post
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url : currentUrl,
          tags: postTags
        })
      })
    )
  )
  saveBtn.disabled = true; // Change view to reflect that link has been saved
  saveForm.innerHTML = `<p>Saved to LinkHub</p>`
})

// Local Login with server
loginForm.addEventListener('submit', function(event) {
  event.preventDefault()
  fetch('https://link--hub.herokuapp.com/auth/login', {
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
    let response = await fetch('https://link--hub.herokuapp.com/auth/me', { // Check if already logged in
    method: 'GET',
    mode: 'cors',
    credentials: 'include'
  })
  if (response.status === 200) { // If logged in, make logout button
      const logoutButton = document.createElement('button')
      logoutButton.innerText = 'Logout'
      logoutButton.onclick = async function() {
        try{
          await fetch('https://link--hub.herokuapp.com/auth/logout', {
          method: 'POST',
          mode: 'cors',
          credentials: 'include'
        })
        location.reload()
        }catch(error){
          console.error(error)
        }
      }//end logout function
      loginInfo.appendChild(logoutButton) // Update View to hide login, and show save and logout buttons
      googleBtn.style.display = "none"
      loginForm.style.display = "none"
      saveForm.style.display = "flex"
    }
  }

    catch(error){
      console.error(error)
    }
}
