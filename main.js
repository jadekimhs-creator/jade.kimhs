document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'light') {
        document.body.classList.add('light-mode');
        if (themeToggle) themeToggle.textContent = '🌙';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            let theme = 'dark';
            if (document.body.classList.contains('light-mode')) {
                theme = 'light';
                themeToggle.textContent = '🌙';
            } else {
                themeToggle.textContent = '☀️';
            }
            localStorage.setItem('theme', theme);
        });
    }

    // Lotto Logic
    const generateBtn = document.getElementById('generate-btn');
    const numbersContainer = document.getElementById('numbers');

    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            generateNumbers();
        });
    }

    function generateNumbers() {
        if (!numbersContainer) return;
        const numbers = new Set();
        while (numbers.size < 6) {
            const randomNum = Math.floor(Math.random() * 45) + 1;
            numbers.add(randomNum);
        }

        const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
        displayNumbers(sortedNumbers);
    }

    function displayNumber(number, index) {
        const numberElement = document.createElement('div');
        numberElement.classList.add('number');
        numberElement.textContent = number;
        numberElement.style.animationDelay = `${index * 100}ms`;
        numbersContainer.appendChild(numberElement);
    }

    function displayNumbers(numbers) {
        numbersContainer.innerHTML = '';
        numbers.forEach((number, index) => {
            displayNumber(number, index);
        });
    }

    // Initial generation for lotto page
    if (numbersContainer) {
        generateNumbers();
    }

    // Video Playlist Logic
    var videoItems = document.querySelectorAll('.video-item');
    var mainVideo = document.getElementById('main-video');

    if (videoItems.length > 0 && mainVideo) {
        for (var i = 0; i < videoItems.length; i++) {
            videoItems[i].onclick = function(e) {
                // If the user clicked the link, let it open in a new tab
                if (e.target.tagName.toLowerCase() === 'a' || e.target.className.indexOf('yt-link') !== -1) {
                    return;
                }

                var videoId = this.getAttribute('data-video');
                if (videoId) {
                    // Update iframe src
                    mainVideo.src = 'https://www.youtube.com/embed/' + videoId;
                    
                    // Update active state in UI
                    for (var j = 0; j < videoItems.length; j++) {
                        videoItems[j].classList.remove('active');
                    }
                    this.classList.add('active');
                    
                    // Scroll to top of video
                    mainVideo.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            };
        }
    }
});
