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


document.getElementById('offerRideButton').addEventListener('click', function() {
    document.getElementById('cancelButton').style.display = 'block';

    fetch('http://localhost:3000/ride-requests')
        .then(response => response.json())
        .then(rideRequests => {
            const list = document.getElementById('rideRequestsList');
            list.innerHTML = ''; // Clear the list
            rideRequests.forEach(request => {
                const listItem = document.createElement('div');
                listItem.innerHTML = `
          <p>From: ${request.fromLocation}, <br>To: ${request.toLocation}<br></p>
          <button onclick="acceptRide('${request._id}')">Accept</button>
        `;
                list.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error:', error));
});

document.getElementById('cancelButton').addEventListener('click', function() {
    // Clear the list
    document.getElementById('rideRequestsList').innerHTML = '';

    // Hide the cancel button again
    this.style.display = 'none';
});
function acceptRide(requestId) {
    document.getElementById('rideRequestsList').innerHTML = '';
    document.getElementById('cancelButton').style.display = 'none';

    fetch(`http://localhost:3000/ride-requests/accept/${requestId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Include authentication token if required
        }
    })
        .then(response => response.json())
        .then(updatedRequest => {
            console.log('Ride accepted:', updatedRequest);
            // Update the UI to reflect the ride acceptance
            // For example, disable the accept button, show a message, or remove the request from the list
        })
        .then(data => {
            console.log('Ride request submitted:', data);
            showMessage('You have accepted this carpool, we will notify the user who requested!');
        })

        .catch(error => console.error('Error:', error));
}

function createRideRequestElement(request) {
    const element = document.createElement('div');
    element.className = 'ride-request';
    element.innerHTML = `
    <p>Ride from: ${request.fromLocation} to ${request.toLocation}<br></p> 
     <p>Departure: ${new Date(request.departureTime).toLocaleString()}<br></p>
    <p>Seats needed: ${request.seatsNeeded}</p><br>
    <button onclick="acceptRideRequest('${request._id}')">Accept<br><br></button>
  `;
    return element;
}

function acceptRideRequest(requestId) {
    // Logic to accept the ride request...
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
