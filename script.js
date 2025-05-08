// User preferences management
const userPreferences = {
    darkMode: false,
    defaultAnimation: 'none',
    animationSpeed: 'normal'
};

// DOM elements
const themeToggleBtn = document.getElementById('theme-toggle');
const rotateBtn = document.getElementById('rotate-btn');
const bounceBtn = document.getElementById('bounce-btn');
const shakeBtn = document.getElementById('shake-btn');
const image = document.getElementById('animated-image');
const defaultAnimationSelect = document.getElementById('default-animation');
const animationSpeedSelect = document.getElementById('animation-speed');
const savePrefsBtn = document.getElementById('save-prefs');
const statusMessage = document.getElementById('status-message');

// Load preferences from localStorage
function loadPreferences() {
    const savedPrefs = localStorage.getItem('animationPreferences');
    if (savedPrefs) {
        const parsedPrefs = JSON.parse(savedPrefs);
        userPreferences.darkMode = parsedPrefs.darkMode;
        userPreferences.defaultAnimation = parsedPrefs.defaultAnimation;
        userPreferences.animationSpeed = parsedPrefs.animationSpeed;
        
        // Apply saved preferences
        if (userPreferences.darkMode) {
            document.body.classList.add('dark-theme');
        }
        
        defaultAnimationSelect.value = userPreferences.defaultAnimation;
        animationSpeedSelect.value = userPreferences.animationSpeed;
        
        // Apply animation speed
        applyAnimationSpeed();
        
        // Apply default animation on load
        if (userPreferences.defaultAnimation !== 'none') {
            setTimeout(() => {
                applyAnimation(userPreferences.defaultAnimation);
            }, 500);
        }
    }
}

// Save preferences to localStorage
function savePreferences() {
    userPreferences.defaultAnimation = defaultAnimationSelect.value;
    userPreferences.animationSpeed = animationSpeedSelect.value;
    
    localStorage.setItem('animationPreferences', JSON.stringify(userPreferences));
    
    showStatusMessage('Preferences saved successfully!', 'success');
    
    // Apply animation speed
    applyAnimationSpeed();
}

// Apply animation to the image
function applyAnimation(animationType) {
    // First remove any existing animation classes
    image.classList.remove('rotate', 'bounce', 'shake');
    
    // Force a reflow before adding the new class
    void image.offsetWidth;
    
    // Add the new animation class
    image.classList.add(animationType);
    
    // Remove the animation class after it completes
    setTimeout(() => {
        image.classList.remove(animationType);
    }, 1000);
}

// Apply button ripple effect
function addRippleEffect(e) {
    const button = e.currentTarget;
    button.classList.remove('ripple');
    void button.offsetWidth; // Force reflow
    button.classList.add('ripple');
    
    setTimeout(() => {
        button.classList.remove('ripple');
    }, 1000);
}

// Apply animation speed based on preference
function applyAnimationSpeed() {
    const speed = userPreferences.animationSpeed;
    const root = document.documentElement;
    
    let duration;
    switch (speed) {
        case 'slow':
            duration = '1.5s';
            break;
        case 'fast':
            duration = '0.3s';
            break;
        default: // normal
            duration = '0.5s';
    }
    
    // Update animation duration for all animations
    const styleSheet = document.styleSheets[0];
    for (let i = 0; i < styleSheet.cssRules.length; i++) {
        const rule = styleSheet.cssRules[i];
        if (rule.type === CSSRule.KEYFRAMES_RULE) {
            // Find the corresponding animation property and update it
            for (let j = 0; j < styleSheet.cssRules.length; j++) {
                const cssRule = styleSheet.cssRules[j];
                if (cssRule.selectorText && 
                    cssRule.selectorText.includes(rule.name) && 
                    cssRule.style && 
                    cssRule.style.animationDuration) {
                    cssRule.style.animationDuration = duration;
                }
            }
        }
    }
}

// Display status message
function showStatusMessage(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = 'status-message ' + type + ' show';
    
    setTimeout(() => {
        statusMessage.classList.remove('show');
    }, 3000);
}

// Event listeners
themeToggleBtn.addEventListener('click', (e) => {
    addRippleEffect(e);
    document.body.classList.toggle('dark-theme');
    userPreferences.darkMode = document.body.classList.contains('dark-theme');
    localStorage.setItem('animationPreferences', JSON.stringify(userPreferences));
});

rotateBtn.addEventListener('click', (e) => {
    addRippleEffect(e);
    applyAnimation('rotate');
});

bounceBtn.addEventListener('click', (e) => {
    addRippleEffect(e);
    applyAnimation('bounce');
});

shakeBtn.addEventListener('click', (e) => {
    addRippleEffect(e);
    applyAnimation('shake');
});

savePrefsBtn.addEventListener('click', (e) => {
    addRippleEffect(e);
    savePreferences();
});

// Add ripple effect to all buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', addRippleEffect);
});

// Load preferences on page load
document.addEventListener('DOMContentLoaded', loadPreferences);