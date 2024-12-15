// Function to handle user login
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = 'profile.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
});

// Function to handle user signup
document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            alert('Signup successful! You can now log in.');
            window.location.href = 'login.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error during signup:', error);
    }
});


// Function to generate mood-based playlist
async function generatePlaylist(mood) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/mood/${mood}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        const playlist = await response.json();
        if (response.ok) {
            displayPlaylist(playlist);
        } else {
            alert(playlist.message);
        }
    } catch (error) {
        console.error('Error fetching playlist:', error);
    }
}

// Function to display the playlist
function displayPlaylist(playlist) {
    const playlistContainer = document.getElementById('playlistContainer');
    playlistContainer.innerHTML = ''; // Clear previous playlist

    if (playlist.length === 0) {
        playlistContainer.innerHTML = '<p>No songs found for this mood.</p>';
        return;
    }

    playlist.forEach(song => {
        const songElement = document.createElement('div');
        songElement.classList.add('song');
        songElement.innerHTML = `
            <h3>${song.title}</h3>
            <p>Artist: ${song.artist}</p>
            <p>Film: ${song.film}</p>
            <p>Genre: ${song.genre}</p>
            <button onclick="playSong('${song.filePath}')">Play</button>
        `;
        playlistContainer.appendChild(songElement);
    });
}

// Function to play a song
function playSong(filePath) {
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.src = filePath;
    audioPlayer.play();
}

// Function to logout
function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

// Initialize event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const pathname = window.location.pathname;

    if (pathname.includes('profile.html')) {
        loadProfile(); // Load profile if on profile page
    }

    // Attach mood button event listeners
    const moodButtons = document.querySelectorAll('.mood-button');
    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            const mood = button.dataset.mood;
            generatePlaylist(mood);
        });
    });

    // Attach logout functionality
    document.getElementById('logoutButton')?.addEventListener('click', logout);
});
