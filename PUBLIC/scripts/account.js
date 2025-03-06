document.addEventListener('DOMContentLoaded', function() {
  const username = localStorage.getItem('username');
  if (!username) {
    window.location.href = 'index.html';
  } else {
    document.getElementById('username').innerText = username;

    fetch(`/api/user/${username}`)
    .then(response => response.json())
    .then(data => {
      const accountDetails = document.getElementById('accountDetails');
      accountDetails.innerHTML = `
        <p>Username: ${data.username}</p>
        <p>Email: ${data.email}</p>
        <!-- Add other account details here -->
      `;
    })
    .catch(error => {
      console.error('Error:', error);
      accountDetails.innerHTML = 'An error occurred while fetching account details';
    });
  }

  document.getElementById('signout').addEventListener('click', function() {
    localStorage.removeItem('username');
    window.location.href = 'index.html';
  });
});
