function getUsers() {
    fetch('http://localhost:8080/users')
      .then(response => response.json())
      .then(data => {
        const tbody = document.querySelector('#userTable tbody');
        tbody.innerHTML = ''; 
  
        data.forEach(user => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.surname}</td>
          `;
          tbody.appendChild(row);
        });
      })
      .catch(error => console.error('Error:', error));
  }
  
  document.getElementById('addUserForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
  
    fetch('http://localhost:8080/addUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, surname })
    })
    .then(response => response.json())
    .then(data => {
      console.log('New user added:', data);
      getUsers(); 
    })
    .catch(error => console.error('Error:', error));
  });
  
  document.getElementById('updateUserForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const id = document.getElementById('userId').value;
    const field = document.getElementById('field').value;
    const value = document.getElementById('newValue').value;
  
    fetch('http://localhost:8080/updateUser', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, field, value })
    })
    .then(response => response.json())
    .then(data => {
      console.log('User updated:', data);
      getUsers(); 
    })
    .catch(error => console.error('Error:', error));
  });
  
  window.onload = getUsers;
  
