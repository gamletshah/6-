require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

app.use(bodyParser.json());
app.use(cors());

// "База данных" в памяти
let users = [];

// Middleware для аутентификации
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// Регистрация пользователя
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = { 
        id: users.length + 1, 
        username, 
        password 
    };
    
    users.push(newUser);
    res.status(201).json({ message: 'User registered successfully' });
});

// Аутентификация пользователя
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Защищенный маршрут
app.get('/protected', authenticateJWT, (req, res) => {
    res.json({ 
        message: 'This is a protected route', 
        user: req.user 
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});