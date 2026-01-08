document.addEventListener('DOMContentLoaded', () => {
    
    const typingTextElement = document.getElementById('typing-text');

    // Add your witty phrases here
    const phrases = [
        "Full-Stack Developer.",
        "Problem Solver.",
        "Bug Hunter.",
        "Coffee-to-Code Converter.",
        "Lifelong Learner.",
        "Creator of Things."
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    // --- Time variables (in milliseconds) ---
    const typingSpeed = 100;     // Speed of typing
    const deletingSpeed = 50;    // Speed of deleting
    const delayBetweenPhrases = 2000; // Pause after typing a word

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            // --- Deleting Logic ---
            typingTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(type, 500); // Pause before typing new word
            } else {
                setTimeout(type, deletingSpeed);
            }
        } else {
            // --- Typing Logic ---
            typingTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentPhrase.length) {
                isDeleting = true;
                setTimeout(type, delayBetweenPhrases); // Pause after word is typed
            } else {
                setTimeout(type, typingSpeed);
            }
        }
    }

    // Start the animation
    type();
});