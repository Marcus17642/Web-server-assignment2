// public/script.js
// Function to get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Get user data from URL parameters
const userData = getUrlParameter('user');
const user = userData ? JSON.parse(userData) : null; // Parse user data if it exists

// Function to update UI based on authentication status
function updateUI() {
    if (user) {
        // Extract first name from displayName
        const firstName = user.displayName.split(' ')[0]; // Get the first name
        // Show greeting
        document.getElementById('greeting').innerText = `Hello, ${firstName}!`;
        document.getElementById('greeting').style.display = 'inline'; // Show greeting

        // Hide login button and show logout button
        document.getElementById('login-button').style.display = 'none';
        document.getElementById('logout-button').style.display = 'inline'; // Show logout button

        // Enable comment input and button if authenticated
        document.getElementById('comment-input').disabled = false;
        document.getElementById('post-button').disabled = false;
        document.getElementById('comment-warning').style.display = 'none'; // Hide warning
    } else {
        // Show message if not authenticated
        document.getElementById('comment-input').disabled = true;
        document.getElementById('post-button').disabled = true;
        document.getElementById('comment-warning').style.display = 'block'; // Show warning
    }
}

// Call the function to update the UI
updateUI();

// Add functionality to the Post button
document.getElementById('post-button').addEventListener('click', function() {
    const comment = document.getElementById('comment-input').value;
    if (comment) {
        // Create a new div for the comment
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment'; // Add class for styling
        commentDiv.textContent = comment; // Set the text of the comment

        // Append the new comment to the comments list
        document.getElementById('comments-list').appendChild(commentDiv);

        // Clear the input field
        document.getElementById('comment-input').value = '';
    } else {
        alert('Please enter a comment before posting.');
    }
});

document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    fetch('/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, message })
    })
    .then(response => response.text())
    .then(data => {
        alert(data); // Show success or error message
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error sending your message.');
    });
}); 