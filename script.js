const card = document.getElementById('card');
let isCardOpen = false; // To prevent re-playing music on multiple clicks
let isVideoAdded = false; // To track if the video has been added

// --- Web Audio API Setup ---
let audioContext; // Declare here, initialize on first click

// Frequencies for the notes (C4 to C5) - adjust as needed
const notes = {
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
    G4: 392.00, A4: 440.00, B4: 493.88, C5: 523.25
};

// Simple "Happy Birthday" tune structure: [frequency, duration in seconds]
// Using note names for clarity
const tune = [
    [notes.C4, 0.25], [notes.C4, 0.25], [notes.D4, 0.5], [notes.C4, 0.5], [notes.F4, 0.5], [notes.E4, 1.0], // Happy Birth-day to
    [notes.C4, 0.25], [notes.C4, 0.25], [notes.D4, 0.5], [notes.C4, 0.5], [notes.G4, 0.5], [notes.F4, 1.0], // you, Happy Birth-day to
    [notes.C4, 0.25], [notes.C4, 0.25], [notes.C5, 0.5], [notes.A4, 0.5], [notes.F4, 0.5], [notes.E4, 0.5], [notes.D4, 1.0], // you, Happy Birth-day dear Jim...
    [notes.A4, 0.25], [notes.A4, 0.25], [notes.G4, 0.5], [notes.F4, 0.5], [notes.G4, 0.5], [notes.F4, 1.0]  // Happy Birth-day to you!
];

function playBirthdayTune() {
    if (!audioContext) {
        // Create AudioContext on the first user interaction
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Check if context is running (might be suspended initially)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine'; // 'sine', 'square', 'sawtooth', 'triangle'
    gainNode.gain.setValueAtTime(0, audioContext.currentTime); // Start silent

    let currentTime = audioContext.currentTime;
    const noteGap = 0.05; // Small gap between notes

    tune.forEach(([freq, duration]) => {
        if (freq) { // Play note
            gainNode.gain.setValueAtTime(0.3, currentTime); // Note volume on
            oscillator.frequency.setValueAtTime(freq, currentTime);
            gainNode.gain.setValueAtTime(0, currentTime + duration - noteGap); // Note volume off just before end
        }
        // If freq is null/0, it's a rest, gain remains 0
        currentTime += duration; // Move time forward
    });

    oscillator.start(audioContext.currentTime);
    oscillator.stop(currentTime); // Stop oscillator after the last note finishes
}
// --- End Web Audio API Setup ---

card.addEventListener('click', () => {
    // Initialize AudioContext on first interaction if needed
    if (!audioContext && !isCardOpen) { // Only init context on the *first* click
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume context if it's suspended (important for autoplay policies)
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }

    if (!isCardOpen) {
        // --- First Click ---
        card.classList.add('open');
        try {
            playBirthdayTune(); // Play the generated tune
            console.log("Birthday tune started!");

            // --- Add Confetti ---
            try {
                let confetti = new Confetti('card'); // Target the card element
                confetti.setCount(80);
                confetti.setSize(1.5);
                confetti.setPower(30);
                confetti.setFade(true);
                confetti.destroyTarget(false);
                console.log("Confetti launched!");
            } catch (confettiError) {
                console.error("Error launching confetti:", confettiError);
                alert("Could not launch confetti effect.");
            }
            // --- End Confetti ---

        } catch (error) {
            console.error("Error playing Web Audio tune:", error);
            alert("Could not play the birthday tune. Your browser might not support the Web Audio API.");
        }
        isCardOpen = true; // Mark card as opened

    } else if (isCardOpen && !isVideoAdded) {
        // --- Second Click ---
        const messageElement = card.querySelector('.message');
        const videoContainer = document.getElementById('video-container');
        const cardInside = card.querySelector('.card-inside'); // Get the card inside element
        const videoId = '9_QpiIkJ63o'; // Extracted from the URL
        const youtubeUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`; // Add autoplay

        // Create the iframe
        const iframe = document.createElement('iframe');
        iframe.setAttribute('src', youtubeUrl);
        iframe.setAttribute('width', '100%'); // Use container's width
        iframe.setAttribute('height', '100%'); // Use container's height
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        iframe.setAttribute('allowfullscreen', ''); // Correct attribute name

        // Clear previous content (optional, could just append)
        videoContainer.innerHTML = '';
        // Add the iframe to the container
        videoContainer.appendChild(iframe);

        // Hide the message and show the video container
        if (messageElement) {
            messageElement.style.display = 'none';
        }
        videoContainer.style.display = 'block';

        // --- Add Tiled Background ---
        if (cardInside) {
            // Remove or hide the original background image if it interferes
            const originalBgImage = cardInside.querySelector('img');
            if (originalBgImage) {
                originalBgImage.style.display = 'none'; // Hide the static background image
            }
            // Set the new tiled background
            cardInside.style.backgroundImage = "url('babygif.webp')";
            cardInside.style.backgroundRepeat = "repeat"; // Tile the image
            cardInside.style.backgroundSize = "100px"; // Adjust size as needed, 'auto' might be too large
            cardInside.style.backgroundColor = "#f0f0f0"; // Optional: set a fallback color
        }
        // --- End Add Tiled Background ---

        isVideoAdded = true; // Mark video as added
        console.log("YouTube video added and background updated.");

    }
    // On third click or later, do nothing for now
});

// Optional focus/blur handling can be removed or adapted if needed
// window.addEventListener('blur', () => { ... });
// window.addEventListener('focus', () => { ... }); 