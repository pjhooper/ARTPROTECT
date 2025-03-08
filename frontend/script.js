document.getElementById('artist-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      artTitle: formData.get('art-title'),
      creationDate: formData.get('creation-date'),
      description: formData.get('description')
  };
  
  const response = await fetch('http://localhost:3000/api/certificate', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  });
  
  if (response.ok) {
      alert('Certificate generated and emailed successfully!');
  } else {
      alert('There was an error generating the certificate.');
  }
});