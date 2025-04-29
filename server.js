const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;

app.use(cors()); // ✅ Включает CORS
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Загружаем пользователей из JSON
const USERS_FILE = path.join(__dirname, 'users.json');

function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Получить всех пользователей
app.get('/users', (req, res) => {
  res.json(loadUsers());
});

// Добавить нового пользователя
app.post('/addUser', (req, res) => {
  const users = loadUsers();
  const { name, surname } = req.body;
  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    name,
    surname
  };
  users.push(newUser);
  saveUsers(users);
  res.json(newUser);
});

// Обновить пользователя
app.patch('/updateUser', (req, res) => {
  const users = loadUsers();
  const { id, name, surname } = req.body;
  const user = users.find(u => u.id === Number(id));
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (name) user.name = name;
  if (surname) user.surname = surname;

  saveUsers(users);
  res.json(user);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
