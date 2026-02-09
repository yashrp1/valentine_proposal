let canRunaway = false;

function nextScreen(screenNumber) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));

    // Show the target screen
    const targetScreen = document.getElementById(`screen-${screenNumber}`);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }

    // Reset runaway flag
    canRunaway = false;

    // Enable runaway after delay (wait for animation)
    if (screenNumber === 10) {
        setTimeout(() => {
            canRunaway = true;
        }, 800);
    }
}

function moveButton(buttonId) {
    if (!canRunaway) return;
    const btn = document.getElementById(buttonId);
    if (!btn) return;

    const container = document.querySelector('.container');

    // Get dimensions
    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    // Calculate new position within the container bounds
    // We deduct button width/height to ensure it stays fully inside
    const maxX = containerRect.width - btnRect.width;
    const maxY = containerRect.height - btnRect.height;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    // Set position to absolute to allow free movement within the relative container
    btn.style.position = 'absolute';
    btn.style.left = `${randomX}px`;
    btn.style.top = `${randomY}px`;
}

function acceptProposal() {
    nextScreen(11); // Updated to Screen 11 (Success)
    launchConfetti();
    createFloatingHearts();
}

function launchConfetti() {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

function createFloatingHearts() {
    setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('bg-heart');
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 2 + 3 + 's';
        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 5000);
    }, 300);
}

// Initial background hearts
createFloatingHearts();

// YouTube Player API
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: 'iYC0aAur79A', // Morni Banke
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'loop': 1,
            'playlist': 'iYC0aAur79A' // Required for loop to work
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    // Player ready, waiting for user interaction
}

function playMusic() {
    if (player && player.playVideo) {
        player.playVideo();
    }
}

// Proximity detection for the "No" button
document.addEventListener('mousemove', function (e) {
    const activeScreen = document.querySelector('.screen.active');
    if (!activeScreen) return;

    // Check for runaway buttons in the active screen
    const btn1 = document.getElementById('runaway-btn-1');
    const btn2 = document.getElementById('runaway-btn-2');

    let targetBtn = null;
    // Only check if the button is actually part of the visible screen
    if (btn1 && activeScreen.contains(btn1)) targetBtn = btn1;
    if (btn2 && activeScreen.contains(btn2)) targetBtn = btn2;

    if (!targetBtn) return;

    // Calculate distance between mouse and button center
    const btnRect = targetBtn.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;

    const distance = Math.sqrt(Math.pow(e.clientX - btnCenterX, 2) + Math.pow(e.clientY - btnCenterY, 2));

    // If cursor is within 150px (Force Field), move the button
    if (distance < 150) {
        moveButton(targetBtn.id);
    }
});

// Better mobile handling
function setupMobileRunaway(btnId) {
    const btn = document.getElementById(btnId);
    if (!btn) return;

    const runaway = (e) => {
        if (!canRunaway) return;
        e.preventDefault(); // Stop click/scroll
        moveButton(btnId);
    };

    btn.addEventListener('touchstart', runaway, { passive: false });
}

// Initialize mobile handlers
document.addEventListener('DOMContentLoaded', () => {
    setupMobileRunaway('runaway-btn-2');
});
