document.addEventListener('DOMContentLoaded', function() {
  const username = localStorage.getItem('username');
  if (!username) {
    window.location.href = 'index.html';
  } else {
    document.getElementById('username').innerText = username;

    fetch(`/api/user/${username}/certificates`)
    .then(response => response.json())
    .then(data => {
      const certificatesList = document.getElementById('certificatesList');
      certificatesList.innerHTML = data.certificates.map(cert => `
        <p>${cert}</p>
      `).join('');
    })
    .catch(error => {
      console.error('Error:', error);
      certificatesList.innerHTML = 'An error occurred while fetching certificates';
    });
  }

  document.getElementById('signout').addEventListener('click', function() {
    localStorage.removeItem('username');
    window.location.href = 'index.html';
  });
});
