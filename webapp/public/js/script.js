document.addEventListener('DOMContentLoaded', function() {
    fetchUsers();
});

function fetchUsers() {
    fetch('http://localhost:3000/users')
        .then(response => response.json())
        .then(data => displayUsers(data))
        .catch(error => console.error('Error fetching users:', error));
}

function displayUsers(users) {
    const usersList = document.getElementById('usersList');
    users.forEach(user => {
        const userItem = document.createElement('li');
        userItem.textContent = `${user.firstName} ${user.lastName} - ${user.email}`;
        usersList.appendChild(userItem);
    });
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('fname').value;

    if (!email || !password) {
        // Afficher un message d'erreur à l'utilisateur
        alert('Veuillez remplir tous les champs d\'identifiants.');
        return; // Arrêter le traitement ici sans soumettre la requête
    } else {
        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
        .then(response => {
            if (response.ok) {
                // Rediriger vers le tableau de bord si la connexion est réussie
                window.location.href = '/dashboard.html';
            } else {
                // Si les identifiants sont faux, réinitialiser la page
                location.reload();
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
});



document.getElementById('signupForm').addEventListener('submit', function(e) {;

    const newUser = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        password: document.getElementById('password').value, // In a real app, you'd hash this before sending
        email: document.getElementById('email').value,
        university: document.getElementById('university').value,
        homeAddress: document.getElementById('homeAddress').value,
        carSeats: document.getElementById('carSeats').value,


    };

    fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // Handle success (e.g., notify user that sign up was successful)
        })
        .catch((error) => {
            console.error('Error:', error);
            // Handle errors (e.g., notify user that sign up failed)
        });
});