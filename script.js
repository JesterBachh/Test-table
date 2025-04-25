const socket = new WebSocket('ws://localhost:8080');
const tableBody = document.querySelector('#userTable tbody');
const notification = document.getElementById('notification');
const addUserBtn = document.getElementById('addUserBtn');
const newNameInput = document.getElementById('newName');
const newSurnameInput = document.getElementById('newSurname');

socket.addEventListener('open', () => {
    console.log('Connected to WebSocket server');
});

socket.addEventListener('message', event => {
    const data = JSON.parse(event.data);
    
    if (data.type === 'init') {
        renderTable(data.data);
    }

    if (data.type === 'update_success') {
        notification.textContent = 'Update successful!';
        notification.style.color = 'green';
        setTimeout(() => notification.textContent = '', 2000);
    }

    if (data.type === 'add_success') {
        notification.textContent = 'User added successfully!';
        notification.style.color = 'green';
        setTimeout(() => notification.textContent = '', 2000);
        renderTable(data.data); 
    }
});

socket.addEventListener('close', () => {
    notification.textContent = 'Connection lost!';
    notification.style.color = 'red';
});

function renderTable(data) {
    tableBody.innerHTML = ''; 
    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.id}</td>
            <td contenteditable="true" data-field="name" data-id="${row.id}">${row.name}</td>
            <td contenteditable="true" data-field="surname" data-id="${row.id}">${row.surname}</td>
        `;
        tableBody.appendChild(tr);
    });

    addCellListeners();
}

function addCellListeners() {
    document.querySelectorAll('td[contenteditable="true"]').forEach(cell => {
        cell.addEventListener('blur', () => {
            const id = cell.getAttribute('data-id');
            const field = cell.getAttribute('data-field');
            const value = cell.innerText.trim();

            socket.send(JSON.stringify({
                type: 'update',
                id: id,
                field: field,
                value: value
            }));
        });
    });
}

addUserBtn.addEventListener('click', () => {
    const name = newNameInput.value.trim();
    const surname = newSurnameInput.value.trim();

    if (name && surname) {
        socket.send(JSON.stringify({
            type: 'add',
            name: name,
            surname: surname
        }));

        newNameInput.value = '';
        newSurnameInput.value = '';
    } else {
        notification.textContent = 'Please enter both Name and Surname.';
        notification.style.color = 'orange';
    }
});