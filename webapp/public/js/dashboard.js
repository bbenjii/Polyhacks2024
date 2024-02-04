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

// Call this function when the page loads or after successful login
