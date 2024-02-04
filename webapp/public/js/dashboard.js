document.addEventListener('DOMContentLoaded', function() {
    fetchAndDisplayUserInfo();});

function fetchAndDisplayUserInfo() {
    fetch('/get-user-info')
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Could not fetch user info');
            }
        })
        .then(data => {
            document.getElementById('userName').textContent = `${data.firstName} ${data.lastName}`;
            document.getElementById('userEmail').textContent = data.email;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

document.getElementById('rideRequestForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const rideRequest = {
        fromLocation: document.getElementById('fromLocation').value,
        toLocation: document.getElementById('toLocation').value,
        departureTime: new Date(document.getElementById('departureTime').value).toISOString(),
        seatsNeeded: parseInt(document.getElementById('seatsNeeded').value, 10),
        additionalInfo: document.getElementById('additionalInfo').value
    };

    fetch('http://localhost:3000/ride-requests', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Include authentication token if required
        },
        body: JSON.stringify(rideRequest),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Ride request submitted:', data);
            // Handle success
        })
        .then(data => {
            console.log('Ride request submitted:', data);
            showMessage('We\'ve received your ride request and will notify you when a driver is available to pick you up.');
        })
        .catch((error) => {
            console.error('Error submitting ride request:', error);
            // Handle errors
        });
});

function showMessage(message, isError) {
    const messageContainer = document.getElementById('messageContainer');
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.className = isError ? 'error-message' : 'success-message';

    // Clear any previous messages
    messageContainer.innerHTML = '';
    // Add the new message
    messageContainer.appendChild(messageDiv);

    // Remove the message after some time
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function logout() {
    fetch('http://localhost:3000/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            // Rediriger vers la page de connexion après la déconnexion réussie
            window.location.href = 'index.html';
        } else {
            // Gérer les erreurs de déconnexion ici
            console.log('Logout failed');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
