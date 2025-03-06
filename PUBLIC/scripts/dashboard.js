document.addEventListener('DOMContentLoaded', function() {
  const username = localStorage.getItem('username');
  if (!username) {
    window.location.href = 'index.html';
  } else {
    document.getElementById('username
