// Function to handle user login
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    console.log('Form Submitted!');  // Debugging log
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
  
        const data = await response.json();
        console.log(data);  // Log response to debug
  
        if (response.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = 'profile.html'; // Update to relative path
        } else {
            alert(data.message);  // Show error message
        }
    } catch (error) {
        console.error('Error:', error);
    }
  });
  
  // Function to handle user signup
  document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;  // Get email from input field
    const password = document.getElementById('password').value;
  
    try {
        const response = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),  // Send username, email, and password
        });
  
        const data = await response.json();
  
        if (response.ok) {
            alert('Signup successful! You can now log in.');
            window.location.href = 'login.html';  // Update to relative path
        } else {
            alert(data.message);  // Display error message
        }
    } catch (error) {
        console.error('Error:', error);
    }
  });
  
  // Function to load user profile data (after login)
  async function loadProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';  // Redirect to login if no token found
        return;
    }
  
    try {
        const response = await fetch('http://localhost:5000/api/user/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Include token in request headers
            },
        });
  
        const user = await response.json();
  
        if (response.ok) {
            // Populate the profile page with user data
            document.getElementById('username').textContent = user.username;
            document.getElementById('history').textContent = user.history.join(', ');
            document.getElementById('interests').textContent = user.interests.join(', ');
        } else {
            alert(user.message);  // Show error message
        }
    } catch (error) {
        console.error('Error:', error);
    }
  }
  
  // Function to generate mood-based playlist
  async function generatePlaylist(mood) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';  // Redirect to login if no token is found
        return;
    }
  
    try {
        const response = await fetch(`http://localhost:5000/api/mood/${mood}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Include token in request headers
            },
        });
  
        const playlist = await response.json();
        if (response.ok) {
            displayPlaylist(playlist);
        } else {
            alert(playlist.message);  // Show error message
        }
    } catch (error) {
        console.error('Error:', error);
    }
  }
  
  // Function to display the generated playlist
  function displayPlaylist(playlist) {
    const playlistContainer = document.getElementById('playlistContainer');
    playlistContainer.innerHTML = '';  // Clear any previous playlist
  
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
  
  // Function to handle song history and profile updates
  async function updateHistory(songId) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';  // Redirect to login if no token is found
        return;
    }
  
    try {
        const response = await fetch('http://localhost:5000/api/user/history', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ songId }),  // Pass the song ID
        });
  
        const result = await response.json();
        if (response.ok) {
            alert('History updated!');
        } else {
            alert(result.message);  // Show error message
        }
    } catch (error) {
        console.error('Error:', error);
    }
  }
  
  // Function to handle logout
  function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';  // Update to relative path
  }
  
  // Check if user is logged in and display profile or redirect to login
  document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname === 'profile.html') {
        loadProfile();  // Load user profile on profile page
    }
  
    // Mood-based playlist generation (button click event)
    const moodButtons = document.querySelectorAll('.mood-button');
    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            const mood = button.dataset.mood;
            generatePlaylist(mood);
        });
    });
  
    // Logout functionality
    document.getElementById('logoutButton')?.addEventListener('click', logout);
  });
  