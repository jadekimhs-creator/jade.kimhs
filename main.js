document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------
    // 1. Theme Toggle Logic
    // --------------------------------------------------
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

    // --------------------------------------------------
    // 2. Lotto Logic
    // --------------------------------------------------
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

    function displayNumbers(numbers) {
        if (!numbersContainer) return;
        numbersContainer.innerHTML = '';
        numbers.forEach((number, index) => {
            const numberElement = document.createElement('div');
            numberElement.classList.add('number');
            numberElement.textContent = number;
            numberElement.style.animationDelay = `${index * 100}ms`;
            numbersContainer.appendChild(numberElement);
        });
    }

    if (numbersContainer) {
        generateNumbers();
    }

    // --------------------------------------------------
    // 3. Video Playlist Logic (Haunted House)
    // --------------------------------------------------
    var videoItems = document.querySelectorAll('.video-item');
    var mainVideo = document.getElementById('main-video');

    if (videoItems.length > 0 && mainVideo) {
        for (var i = 0; i < videoItems.length; i++) {
            videoItems[i].onclick = function(e) {
                if (e.target.tagName.toLowerCase() === 'a' || e.target.className.indexOf('yt-link') !== -1) {
                    return;
                }
                var videoId = this.getAttribute('data-video');
                if (videoId) {
                    mainVideo.src = 'https://www.youtube.com/embed/' + videoId;
                    for (var j = 0; j < videoItems.length; j++) {
                        videoItems[j].classList.remove('active');
                    }
                    this.classList.add('active');
                    mainVideo.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            };
        }
    }

    // --------------------------------------------------
    // 4. Our Journey Movie Logic (Provided Source)
    // --------------------------------------------------
    const music = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-toggle');
    const movieSlideshow = document.getElementById('slideshow');
    const movieText = document.getElementById('movie-text');

    // 재생 로직
    if (music && musicBtn) {
        music.volume = 0.6; // 볼륨 상향

        const playMusic = () => {
            music.play().then(() => {
                musicBtn.innerText = "🔊 Music Off";
                musicBtn.classList.add('playing');
            }).catch(err => {
                console.log("화면을 클릭해야 재생됩니다!", err);
            });
        };

        const pauseMusic = () => {
            music.pause();
            musicBtn.innerText = "🎵 Music On";
            musicBtn.classList.remove('playing');
        };

        musicBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (music.paused) playMusic();
            else pauseMusic();
        });

        document.body.addEventListener('click', () => {
            if (music.paused) playMusic();
        }, { once: true });
    }

    // 슬라이드쇼
    if (movieSlideshow) {
        const movieImages = [
            'img/KakaoTalk_20260422_000845968.jpg', 'img/KakaoTalk_20260422_000845968_01.jpg',
            'img/KakaoTalk_20260422_000845968_02.jpg', 'img/KakaoTalk_20260422_000845968_03.jpg',
            'img/KakaoTalk_20260422_000845968_04.jpg', 'img/KakaoTalk_20260422_000845968_05.jpg',
            'img/KakaoTalk_20260422_000845968_06.jpg', 'img/KakaoTalk_20260422_000845968_07.jpg',
            'img/KakaoTalk_20260422_000845968_08.jpg', 'img/KakaoTalk_20260422_000845968_09.jpg',
            'img/KakaoTalk_20260422_000845968_10.jpg', 'img/KakaoTalk_20260422_000845968_11.jpg',
            'img/KakaoTalk_20260422_000845968_12.jpg', 'img/KakaoTalk_20260422_000845968_13.jpg',
            'img/KakaoTalk_20260422_000845968_14.jpg', 'img/KakaoTalk_20260422_000845968_15.jpg',
            'img/KakaoTalk_20260422_000845968_16.jpg', 'img/KakaoTalk_20260422_000845968_17.jpg'
        ];

        const messages = [
            "본격적인 우리의 이야기 출발! 🚀",
            "빵 터졌던 그날 기억나? 😆",
            "함께라서 매일매일이 시트콤 팝콘각 🍿",
            "앞으로도 이렇게 신나게 놀자! 🎉",
            "너랑 노는 게 제일 재밌어 👍",
            "우리의 즐거운 에너지는 무한대! ⚡"
        ];

        movieImages.forEach((src) => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.style.backgroundImage = `url('${src}')`;
            movieSlideshow.appendChild(slide);
        });

        const slides = movieSlideshow.querySelectorAll('.slide');
        let currentIdx = 0;
        let messageIdx = 0;

        function updateMovieSlide() {
            if (slides.length === 0) return;
            slides.forEach(s => s.classList.remove('active'));
            slides[currentIdx].classList.add('active');
            
            if (currentIdx % 2 === 0) {
                if (movieText) {
                    movieText.classList.remove('active');
                    setTimeout(() => {
                        movieText.innerText = messages[messageIdx];
                        movieText.classList.add('active');
                        messageIdx = (messageIdx + 1) % messages.length;
                    }, 1000);
                }
            }
            currentIdx = (currentIdx + 1) % slides.length;
        }

        updateMovieSlide();
        setInterval(updateMovieSlide, 5000);
    }

    // 갤러리 모달
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('expandedImg');
    const galleryImages = document.querySelectorAll('.gallery-item img');

    if (modal && modalImg) {
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                modal.style.display = "block";
                modalImg.src = img.src;
            });
        });
        document.querySelector('.close')?.addEventListener('click', () => modal.style.display = "none");
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = "none"; });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === "Escape" && modal.style.display === "block") {
                modal.style.display = "none";
            }
        });
    }
});