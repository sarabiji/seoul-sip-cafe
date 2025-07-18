// --- Web Audio API Sound System ---
const soundIds = ['music', 'rain', 'cafe', 'cups', 'machinery', 'sunny', 'fireplace'];
const soundFiles = {
  music: 'sounds/music.mp3',
  rain: 'sounds/rain.mp3',
  cafe: 'sounds/cafe-people.mp3',
  cups: 'sounds/coffe-cup.mp3',
  machinery: 'sounds/machine.mp3',
  sunny: 'sounds/sunny.mp3',
  fireplace: 'sounds/fireplace.mp3',
};
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const gainNodes = {};
const panNodes = {};
const bufferSources = {};
const audioBuffers = {};

// Helper to load a sound file as AudioBuffer
async function loadSound(id, url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${url}`);
    const arrayBuffer = await response.arrayBuffer();
    audioBuffers[id] = await audioContext.decodeAudioData(arrayBuffer);
  } catch (err) {
    alert(`Error loading sound: ${id} (${url})\n${err.message}`);
  }
}

// Load all sounds
Promise.all(soundIds.map(id => loadSound(id, soundFiles[id]))).then(() => {
  // After all loaded, start all sounds in loop
  soundIds.forEach(id => {
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffers[id];
    source.loop = true;
    const gainNode = audioContext.createGain();
    const panNode = audioContext.createStereoPanner();
    gainNode.gain.value = 0.5;
    panNode.pan.value = 0;
    source.connect(gainNode).connect(panNode).connect(audioContext.destination);
    source.start(0);
    gainNodes[id] = gainNode;
    panNodes[id] = panNode;
    bufferSources[id] = source;
  });
});

// --- UI Logic ---
const sliderElements = document.querySelectorAll('input[type="range"]:not(.pan-slider)');
const panSliderElements = document.querySelectorAll('.pan-slider');

// Volume slider event listeners
sliderElements.forEach(slider => {
  slider.addEventListener("input", e => {
    audioContext.resume();
    const soundKey = slider.id.replace('Slider', '');
    const volume = parseFloat(e.target.value);
    if (gainNodes[soundKey]) {
      gainNodes[soundKey].gain.setValueAtTime(volume, audioContext.currentTime);
    }
  });
});

// Pan slider event listeners
panSliderElements.forEach(panSlider => {
  panSlider.addEventListener("input", e => {
    audioContext.resume();
    const soundKey = panSlider.id.replace('Pan', '');
    const panValue = parseFloat(e.target.value);
    if (panNodes[soundKey]) {
      panNodes[soundKey].pan.setValueAtTime(panValue, audioContext.currentTime);
    }
  });
});

// Default button
const defaultBtn = document.getElementById("defaultButton");
defaultBtn.addEventListener("click", () => {
  audioContext.resume();
  sliderElements.forEach(slider => {
    slider.value = 0.5;
    const soundKey = slider.id.replace('Slider', '');
    if (gainNodes[soundKey]) {
      gainNodes[soundKey].gain.setValueAtTime(0.5, audioContext.currentTime);
    }
  });
  panSliderElements.forEach(panSlider => {
    panSlider.value = 0;
    const soundKey = panSlider.id.replace('Pan', '');
    if (panNodes[soundKey]) {
      panNodes[soundKey].pan.setValueAtTime(0, audioContext.currentTime);
    }
  });
});

// Mute All button
const muteAllButton = document.getElementById('muteAllButton');
let allMuted = false;
const muteIcon = muteAllButton.querySelector('i');
muteAllButton.addEventListener('click', () => {
  audioContext.resume();
  allMuted = !allMuted;
  if (allMuted) {
    muteIcon.classList.remove('fa-volume-high');
    muteIcon.classList.add('fa-volume-xmark');
    muteAllButton.title = 'Unmute All';
    sliderElements.forEach(slider => {
      slider.value = 0;
      const soundKey = slider.id.replace('Slider', '');
      if (gainNodes[soundKey]) {
        gainNodes[soundKey].gain.setValueAtTime(0, audioContext.currentTime);
      }
    });
  } else {
    muteIcon.classList.remove('fa-volume-xmark');
    muteIcon.classList.add('fa-volume-high');
    muteAllButton.title = 'Mute All';
    sliderElements.forEach(slider => {
      slider.value = 0.5;
      const soundKey = slider.id.replace('Slider', '');
      if (gainNodes[soundKey]) {
        gainNodes[soundKey].gain.setValueAtTime(0.5, audioContext.currentTime);
      }
    });
  }
});

// Spotify playlist input
const spotifyBtn = document.getElementById('spotifyBtn');
const spotifyInput = document.getElementById('spotifyInput');
const spotifyIframe = document.getElementById('spotify-iframe');
const spotifyLoading = document.getElementById('spotify-loading');
const spotifyClearBtn = document.getElementById('spotifyClearBtn');

const DEFAULT_SPOTIFY = 'https://open.spotify.com/embed/playlist/37i9dQZF1DWVFeEut75IAL?utm_source=generator';

function showSpotifyLoading(show) {
  if (spotifyLoading) spotifyLoading.style.display = show ? 'flex' : 'none';
}

function isValidSpotifyUrl(url) {
  return /^(https?:\/\/)?(open\.)?spotify\.com\/(playlist|album|track)\/[a-zA-Z0-9]+/.test(url);
}

spotifyBtn.addEventListener('click', () => {
  audioContext.resume();
  let url = spotifyInput.value.trim();
  if (!isValidSpotifyUrl(url)) {
    alert('Please enter a valid Spotify playlist, album, or track link.');
    return;
  }
  showSpotifyLoading(true);
  if (url) {
    // Extract playlist ID and build embed URL if needed
    let embedUrl = url;
    if (!url.includes('/embed/')) {
      // Try to extract playlist/album/track ID
      const match = url.match(/(playlist|album|track)\/([a-zA-Z0-9]+)/);
      if (match) {
        embedUrl = `https://open.spotify.com/embed/${match[1]}/${match[2]}`;
      }
    }
    spotifyIframe.onload = () => showSpotifyLoading(false);
    spotifyIframe.src = embedUrl;
    localStorage.setItem('spotifyPlaylist', embedUrl);
  }
});

spotifyClearBtn.addEventListener('click', () => {
  audioContext.resume();
  showSpotifyLoading(true);
  spotifyIframe.onload = () => showSpotifyLoading(false);
  spotifyIframe.src = DEFAULT_SPOTIFY;
  spotifyInput.value = '';
  localStorage.removeItem('spotifyPlaylist');
});

// --- Top-right controls ---
const infoBtn = document.getElementById('infoBtn');
const themeBtn = document.getElementById("themeBtn");
const todoBtn = document.getElementById('todoBtn');
const infoModal = document.getElementById('infoModal');
const todoModal = document.getElementById('todoModal');
const closeInfo = document.getElementById('closeInfo');
const closeTodo = document.getElementById('closeTodo');

function openModal(modal) {
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeModal(modal) {
  modal.style.display = 'none';
  document.body.style.overflow = '';
}
infoBtn.addEventListener('click', () => openModal(infoModal));

// Remove close buttons for both modals
if (closeInfo) closeInfo.remove();
if (closeTodo) closeTodo.remove();

// Clicking outside modal content closes the modal (for both modals)
[infoModal, todoModal].forEach(modal => {
  if (!modal) return;
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  });
});
todoBtn.addEventListener('click', () => openModal(todoModal));

window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    [infoModal, todoModal].forEach(m => closeModal(m));
  }
});

// Theme toggle (new button)
function updateThemeIcon() {
  const icon = themeBtn.querySelector('i');
  if (document.body.classList.contains('light')) {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  } else {
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
  }
}
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
  updateThemeIcon();
});

// Set correct icon and restore theme/Spotify on page load
window.addEventListener('DOMContentLoaded', () => {
  // Show start overlay and block sound until user clicks
  const startOverlay = document.getElementById('start-overlay');
  const startCafeBtn = document.getElementById('startCafeBtn');
  if (startOverlay && startCafeBtn) {
    startOverlay.style.display = 'flex';
    // Block all controls until started
    document.body.style.overflow = 'hidden';
    startCafeBtn.addEventListener('click', () => {
      audioContext.resume();
      startOverlay.style.display = 'none';
      document.body.style.overflow = '';
    }, { once: true });
  }
  // Restore theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light');
  } else {
    document.body.classList.remove('light');
  }
  updateThemeIcon();
  
  // Restore Spotify playlist
  const savedPlaylist = localStorage.getItem('spotifyPlaylist');
  if (savedPlaylist) {
    spotifyIframe.src = savedPlaylist;
    spotifyInput.value = savedPlaylist;
  } else {
    spotifyIframe.src = DEFAULT_SPOTIFY;
    spotifyInput.value = '';
  }
  // Ensure open by default on load
  const containerToggle = document.getElementById('containerToggle');
  const overlay = document.querySelector('.overlay');
  overlay.classList.remove('container-closed');
  // Pan controls visibility
  const panToggleCheckbox = document.getElementById('panToggleCheckbox');
  panToggleCheckbox.checked = false; // Default to unchecked
  updatePanControlsVisibility();

  // Focus Mode button
  const focusModeBtn = document.getElementById('focusModeBtn');
  let focusMode = false;
  focusModeBtn.addEventListener('click', () => {
    focusMode = !focusMode;
    document.body.classList.toggle('focus-mode', focusMode);
    // Change icon and tooltip
    const icon = focusModeBtn.querySelector('i');
    if (focusMode) {
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
      focusModeBtn.title = 'Exit Focus Mode';
    } else {
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
      focusModeBtn.title = 'Focus Mode';
    }
  });

  // --- Spotify SDK Auth ---
  const params = getHashParams();
  if (params.access_token) {
    spotifyAccessToken = params.access_token;
    window.location.hash = '';
    startSpotifySDK();
  }
});

// --- To-Do List ---
const todoInput = document.getElementById('todoInput');
const addTodo = document.getElementById('addTodo');
const todoList = document.getElementById('todoList');

function loadTodos() {
  const todos = JSON.parse(localStorage.getItem('todos') || '[]');
  todoList.innerHTML = '';
  todos.forEach((todo, idx) => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.completed ? ' completed' : '');

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = !!todo.completed;
    checkbox.addEventListener('change', () => {
      todos[idx].completed = checkbox.checked;
      localStorage.setItem('todos', JSON.stringify(todos));
      loadTodos();
    });
    li.appendChild(checkbox);

    // Text
    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = todo.text;
    li.appendChild(span);

    // Remove button
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.title = 'Remove';
    removeBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      todos.splice(idx, 1);
      localStorage.setItem('todos', JSON.stringify(todos));
      loadTodos();
    });
    li.appendChild(removeBtn);

    // Toggle completed on text click
    span.addEventListener('click', () => {
      checkbox.checked = !checkbox.checked;
      checkbox.dispatchEvent(new Event('change'));
    });

    todoList.appendChild(li);
  });
}

function addTodoItem() {
  const val = todoInput.value.trim();
  if (!val) return;
  const todos = JSON.parse(localStorage.getItem('todos') || '[]');
  todos.push({ text: val, completed: false });
  localStorage.setItem('todos', JSON.stringify(todos));
  todoInput.value = '';
  loadTodos();
}
addTodo.addEventListener('click', addTodoItem);
todoInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTodoItem();
});
loadTodos();

// Pan control toggle logic
const panToggleCheckbox = document.getElementById('panToggleCheckbox');
function updatePanControlsVisibility() {
  const show = panToggleCheckbox.checked;
  document.querySelectorAll('.pan-row').forEach(row => {
    row.style.display = show ? 'flex' : 'none';
  });
}
panToggleCheckbox.addEventListener('change', updatePanControlsVisibility);

// Sliding container panel logic
const containerToggle = document.getElementById('containerToggle');
const overlay = document.querySelector('.overlay');
containerToggle.addEventListener('click', () => {
  overlay.classList.toggle('container-closed');
});


