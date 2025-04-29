function getUsers() {
  fetch('/users')
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector('#userTable tbody');
      tbody.innerHTML = '';

      data.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>${user.surname}</td>
          <td><button onclick="editUser(${user.id}, '${user.name}', '${user.surname}')">Edit</button></td>
        `;
        tbody.appendChild(row);
      });
    });
}

document.getElementById('userForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const id = document.getElementById('userId').value;
  const name = document.getElementById('name').value;
  const surname = document.getElementById('surname').value;

  const url = id ? '/updateUser' : '/addUser';
  const method = id ? 'PATCH' : 'POST';
  const payload = id ? { id, name, surname } : { name, surname };

  fetch(url, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(() => {
      getUsers();
      document.getElementById('userForm').reset();
      document.getElementById('submitBtn').innerText = 'Add User';
    });
});

function editUser(id, name, surname) {
  document.getElementById('userId').value = id;
  document.getElementById('name').value = name;
  document.getElementById('surname').value = surname;
  document.getElementById('submitBtn').innerText = 'Update User';
}

window.onload = getUsers;
