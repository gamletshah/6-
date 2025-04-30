let token = null;

// Регистрация пользователя
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch('http://localhost:3001/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        document.getElementById('registerMessage').textContent = result.message || 
            (response.ok ? 'Registration successful' : 'Registration failed');
    } catch (error) {
        document.getElementById('registerMessage').textContent = 'Error during registration';
    }
});

// Вход пользователя
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        if (response.ok) {
            token = result.token;
            document.getElementById('loginMessage').textContent = 'Login successful';
            document.getElementById('loginMessage').style.color = 'green';
        } else {
            document.getElementById('loginMessage').textContent = result.message || 'Login failed';
            document.getElementById('loginMessage').style.color = 'red';
        }
    } catch (error) {
        document.getElementById('loginMessage').textContent = 'Error during login';
        document.getElementById('loginMessage').style.color = 'red';
    }
});

// Получение защищенных данных
document.getElementById('fetchProtectedData').addEventListener('click', async () => {
    const outputElement = document.getElementById('protectedData');
    
    if (!token) {
        outputElement.textContent = 'Please login first';
        return;
    }

    try {
        const response = await fetch('http://localhost:3001/protected', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const result = await response.json();
            outputElement.textContent = JSON.stringify(result, null, 2);
        } else {
            outputElement.textContent = 'Access denied';
        }
    } catch (error) {
        outputElement.textContent = 'Error fetching protected data';
    }
});