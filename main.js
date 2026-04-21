document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------
    // 1. Theme Toggle Logic (홈 화면용)
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
    // 2. Lotto Logic (로또 페이지용)
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
    // 3. Video Playlist Logic (흉가 페이지용)
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
    // 4. 음악 재생 로직 (MP3 전용 - 제공된 소스 적용)
    // --------------------------------------------------
    const music = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-toggle');

    if (music && musicBtn) {
        music.volume = 0.4;

        const playMusic = () => {
            music.play().then(() => {
                musicBtn.innerText = "🔊 Music Off";
                musicBtn.classList.add('playing');
            }).catch(err => {
                console.log("재생 준비 중...", err);
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

    // --------------------------------------------------
    // 5. 슬라이드쇼 로직 (제공된 소스 적용)
    // --------------------------------------------------
    const movieSlideshow = document.getElementById('slideshow');
    const movieText = document.getElementById('movie-text');

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
            "우리의 소중한 기록들을 시작합니다...",
            "함께 웃고 떠들던 그날의 기억",
            "우리는 조금씩 서로에게 물들어갔죠",
            "함께 걷는 이 길이 너무나 소중해요",
            "우리의 매 순간이 영화 같은 기적",
            "사랑하는 마음을 담아 기록합니다."
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

    // --------------------------------------------------
    // 6. 갤러리 모달 로직 (제공된 소스 적용)
    // --------------------------------------------------
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