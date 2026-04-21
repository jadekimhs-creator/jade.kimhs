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

    // Gallery Image Modal Logic
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('expandedImg');
    const galleryImages = document.querySelectorAll('.gallery-item img');
    const closeModal = document.querySelector('.close');

    if (modal && modalImg && galleryImages.length > 0) {
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                modal.style.display = "block";
                modalImg.src = img.src;
            });
        });

        const closeFunc = () => {
            modal.style.display = "none";
        };

        if (closeModal) {
            closeModal.addEventListener('click', closeFunc);
        }

        // Close when clicking background
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeFunc();
            }
        });

        // Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === "Escape" && modal.style.display === "block") {
                closeFunc();
            }
        });
    }

    // Our Journey Movie (Cinematic Slideshow)
    const movieSlideshow = document.getElementById('slideshow');
    const movieText = document.getElementById('movie-text');
    const music = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-toggle');
    
    if (movieSlideshow) {
        const movieImages = [
            'img/KakaoTalk_20260422_000845968.jpg',
            'img/KakaoTalk_20260422_000845968_01.jpg',
            'img/KakaoTalk_20260422_000845968_02.jpg',
            'img/KakaoTalk_20260422_000845968_03.jpg',
            'img/KakaoTalk_20260422_000845968_04.jpg',
            'img/KakaoTalk_20260422_000845968_05.jpg',
            'img/KakaoTalk_20260422_000845968_06.jpg',
            'img/KakaoTalk_20260422_000845968_07.jpg',
            'img/KakaoTalk_20260422_000845968_08.jpg',
            'img/KakaoTalk_20260422_000845968_09.jpg',
            'img/KakaoTalk_20260422_000845968_10.jpg',
            'img/KakaoTalk_20260422_000845968_11.jpg',
            'img/KakaoTalk_20260422_000845968_12.jpg',
            'img/KakaoTalk_20260422_000845968_13.jpg',
            'img/KakaoTalk_20260422_000845968_14.jpg',
            'img/KakaoTalk_20260422_000845968_15.jpg',
            'img/KakaoTalk_20260422_000845968_16.jpg',
            'img/KakaoTalk_20260422_000845968_17.jpg'
        ];

        const messages = [
            "우리의 소중한 기록들을 시작합니다...",
            "함께 웃고 떠들던 그날의 기억",
            "우리는 조금씩 서로에게 물들어갔죠",
            "함께 걷는 이 길이 너무나 소중해요",
            "우리의 매 순간이 영화 같은 기적",
            "앞으로도 더 많은 추억을 쌓아가요",
            "사랑한다는 말보다 더 깊은 진심으로",
            "우리의 이야기는 현재진행형입니다."
        ];

        // Create slides
        movieImages.forEach((src) => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.style.backgroundImage = `url(${src})`;
            movieSlideshow.appendChild(slide);
        });

        const slides = movieSlideshow.querySelectorAll('.slide');
        let currentIdx = 0;
        let messageIdx = 0;

        function updateMovieSlide() {
            slides.forEach(s => s.classList.remove('active'));
            slides[currentIdx].classList.add('active');
            
            if (currentIdx % 2 === 0) {
                movieText.classList.remove('active');
                setTimeout(() => {
                    movieText.innerText = messages[messageIdx];
                    movieText.classList.add('active');
                    messageIdx = (messageIdx + 1) % messages.length;
                }, 1000);
            }
            currentIdx = (currentIdx + 1) % slides.length;
        }

        updateMovieSlide();
        setInterval(updateMovieSlide, 5000);
        
        // Music toggle logic
        if (musicBtn && music) {
            music.volume = 0.5; // Set volume to 0.5
            
            musicBtn.addEventListener('click', () => {
                if (music.paused) {
                    music.play().then(() => {
                        musicBtn.classList.add('playing');
                        musicBtn.innerText = "🔊 Music Off";
                    }).catch(error => {
                        console.log("재생 실패:", error);
                    });
                } else {
                    music.pause();
                    musicBtn.classList.remove('playing');
                    musicBtn.innerText = "🎵 Music On";
                }
            });

            // Handle potential loading errors
            music.onerror = () => {
                console.error("Audio failed to load");
                musicBtn.innerText = "⚠️ Music Error";
            };
        }
    }
});
