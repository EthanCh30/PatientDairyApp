let selectedRole = null;

function loadContent(page) {
    fetch(page)
        .then(response => response.text())
        .then(data => document.getElementById('content-placeholder').innerHTML = data)
        .catch(error => console.error('Failed to load page:', error));
}

function showForm(role) {
    selectedRole = role;

    fetch('log_in.html')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not OK');
            return response.text();
        })
        .then(data => {
            document.getElementById('loginContainer').innerHTML = data;
            document.getElementById('loginForm').action = role.toLowerCase() + '_dashboard.html';
            
            let welcomeMessage = {
                therapist: 'Welcome back!',
                user: 'Welcome back!',
                staff: 'Welcome back!',
                auditor: 'Welcome back!'
            }[role.toLowerCase()] || 'Welcome';
            
            document.getElementById('welcomeMessage').innerText = welcomeMessage;
            document.getElementById('loginModal').style.display = "block";
        })
        .catch(error => console.error('Failed to load form:', error));
}

function showRegisterFields() {
    const extraFields = document.getElementById('extraFields');
    extraFields.classList.remove('hidden');
    extraFields.classList.add('visible');
    
    document.getElementById('submitButton').innerText = 'Register';
    document.getElementById('registerButton').style.display = 'none';
}

function handleSubmit() {
    loginUser();
}

function registerUser() {
    const email = document.getElementById('email').value;
    const confirmEmail = document.getElementById('confirmEmail').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (email !== confirmEmail) {
        alert('Emails do not match');
        return;
    }
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    fetch('/checkUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.exists) {
            alert('User already exists');
        } else {
            createAccount(email, password);
        }
    })
    .catch(error => console.error('Check user failed:', error));
}

function createAccount(email, password) {
    fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Registration successful');
            loginUser(email, password);  // Log the user in automatically
        } else {
            alert('Registration failed');
        }
    })
    .catch(error => console.error('Registration failed:', error));
}

function loginUser(username = document.getElementById('username').value, password = document.getElementById('password').value) {
    const role = selectedRole;

    if (username === 'admin' && password === 'admin') {
        const data = { success: true, role: role };
        document.getElementById('loginModal').style.display = "none";
        redirectToDashboard(data.role);
    } else {
        fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('loginModal').style.display = "none";
                redirectToDashboard(role);
            } else {
                alert('Invalid username or password');
            }
        })
        .catch(error => console.error('Login failed:', error));
    }
}

function redirectToDashboard(role) {
    if(role == 'therapist'){
        window.location.href = 'http://localhost/www/Group%2005/COMP9030-Group05/pages/therapist/therapist_dashboard.html';
    }
    else if (role == 'user'){
        window.location.href = 'http://localhost/www/Group%2005/COMP9030-Group05/pages/patient/user_dashboard.html';
    }
    else if (role == 'staff'){
        window.location.href = 'http://localhost/www/Group%2005/COMP9030-Group05/pages/staff/staff_dashboard.html';
    }
    else if (role == 'auditor'){
        window.location.href = 'http://localhost/www/Group%2005/COMP9030-Group05/pages/auditor/auditor_dashboard.html';
    }
   
}

window.onclick = function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    loadContent('about_us.html');
});