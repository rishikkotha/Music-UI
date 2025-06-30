// music_management.js

// --- Music Data Management ---

// Default songs (SET TO EMPTY ARRAY TO REMOVE ALL DEFAULT SONGS)
const defaultSongs = []; // Keeping this empty as songs will be added by artists

// Load songs from Local Storage or use defaults
function getSongs() {
    let songs = JSON.parse(localStorage.getItem('soundwave_songs'));
    if (!songs || songs.length === 0) {
        songs = defaultSongs; // Will now be an empty array if defaultSongs is empty
        localStorage.setItem('soundwave_songs', JSON.stringify(songs));
    }
    return songs;
}

function saveSongs(songs) {
    localStorage.setItem('soundwave_songs', JSON.stringify(songs));
}

// Function to add a new song
// Expects song object to include: id, title, artist, src, cover, duration, artistId
function addSong(song) {
    let songs = getSongs();
    // Generate a unique ID if not provided (e.g., for new uploads)
    if (!song.id) {
        song.id = 'song_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // --- ADDED CONSOLE.LOG ---
    console.log("music_management.js: addSong - Adding song:", song);

    songs.push(song);
    saveSongs(songs);

    // --- ADDED CONSOLE.LOG ---
    console.log("music_management.js: addSong - Songs array after adding:", songs);
    return true; // Indicate success
}

// Function to update an existing song
function updateSong(updatedSong) {
    let songs = getSongs();
    const index = songs.findIndex(s => s.id === updatedSong.id);
    if (index !== -1) {
        songs.splice(index, 1, updatedSong); // Use splice to replace the element
        saveSongs(songs);
        return true;
    }
    return false;
}

// Function to delete a song
function deleteSong(songId) {
    let songs = getSongs();
    const initialLength = songs.length;
    songs = songs.filter(s => s.id !== songId);
    saveSongs(songs);
    return songs.length < initialLength; // True if a song was removed
}

// --- Playlist Management ---
function getPlaylists() {
    return JSON.parse(localStorage.getItem('soundwave_playlists')) || {};
}

function addSongToPlaylist(songId, playlistName) {
    let playlists = getPlaylists();
    if (!playlists[playlistName]) {
        playlists[playlistName] = [];
    }
    if (!playlists[playlistName].includes(songId)) {
        playlists[playlistName].push(songId);
        localStorage.setItem('soundwave_playlists', JSON.stringify(playlists));
        return true;
    }
    return false; // Already in playlist or playlist doesn't exist
}

function removeSongFromPlaylist(songId, playlistName) {
    let playlists = getPlaylists();
    if (playlists && playlists.hasOwnProperty(playlistName)) {
        const initialLength = playlists[playlistName].length;
        playlists[playlistName] = playlists[playlistName].filter(id => id !== songId);
        localStorage.setItem('soundwave_playlists', JSON.stringify(playlists));
        return playlists[playlistName].length < initialLength;
    }
    return false;
}

// --- Liked Songs Management ---
function getLikedSongs() {
    return JSON.parse(localStorage.getItem('soundwave_liked_songs')) || [];
}

// Toggles the like status of a song. Returns true if liked, false if unliked.
function toggleLikeSong(songId, forceLike = undefined) {
    let likedSongs = getLikedSongs();
    const index = likedSongs.indexOf(songId);

    if (forceLike === true) {
        if (index === -1) { // Only add if not already liked
            likedSongs.push(songId);
        }
    } else if (forceLike === false) {
        if (index !== -1) { // Only remove if liked
            likedSongs.splice(index, 1);
        }
    } else { // Toggle behavior
        if (index === -1) {
            likedSongs.push(songId);
        } else {
            likedSongs.splice(index, 1);
        }
    }
    localStorage.setItem('soundwave_liked_songs', JSON.stringify(likedSongs));
    return likedSongs.includes(songId); // Return current like status
}

function isSongLiked(songId) {
    return getLikedSongs().includes(songId);
}

// --- Recently Played Management ---
function getRecentlyPlayed() {
    return JSON.parse(localStorage.getItem('soundwave_recently_played')) || [];
}

function addRecentlyPlayed(songId) {
    let recentlyPlayed = getRecentlyPlayed();
    // Remove if already exists to move it to the top
    const index = recentlyPlayed.indexOf(songId);
    if (index !== -1) {
        recentlyPlayed.splice(index, 1);
    }
    // Add to the beginning
    recentlyPlayed.unshift(songId);
    // Keep only the last 20 songs (or any desired limit)
    if (recentlyPlayed.length > 20) {
        recentlyPlayed = recentlyPlayed.slice(0, 20);
    }
    localStorage.setItem('soundwave_recently_played', JSON.stringify(recentlyPlayed));
}

// --- User Data (for login/logout simulation) ---
// This part is assumed to be handled by loginpageuser.html, but included for context.
function getUserData() {
    return JSON.parse(sessionStorage.getItem('currentUser'));
}

function saveUserData(user) {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
}

function clearUserData() {
    sessionStorage.removeItem('currentUser');
}

// Expose functions to the global scope
window.SoundWave = {
    getSongs,
    addSong,
    updateSong,
    deleteSong,
    toggleLikeSong,
    getLikedSongs,
    isSongLiked,
    getPlaylists,
    addSongToPlaylist,
    removeSongFromPlaylist,
    getRecentlyPlayed,
    addRecentlyPlayed,
    getUserData,
    saveUserData,
    clearUserData
};