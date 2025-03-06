document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('/api/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
    const responseMessage = document.getElementById('responseMessage');
    if (data.success) {
      localStorage.setItem('username', username);
      window.location.href = 'dashboard.html';
    } else {
      responseMessage.innerHTML = 'Sign-In Failed: ' + data.message;
    }
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('responseMessage').innerHTML = 'An error occurred';
  });
});

document.getElementById('signupForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const username = document.getElementById('newUsername').value;
  const password = document.getElementById('newPassword').value;

  fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
    const signupResponseMessage = document.getElementById('signupResponseMessage');
    if (data.success) {
      signupResponseMessage.innerHTML = 'Sign-Up Successful! Please check your email to verify your account.';
    } else {
      signupResponseMessage.innerHTML = 'Sign-Up Failed: ' + data.message;
    }
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('signupResponseMessage').innerHTML = 'An error occurred';
  });
});
