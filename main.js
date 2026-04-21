document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------
    // 1. Theme Toggle Logic (기존 유지)
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
    // 2. Lotto Logic (기존 유지)
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
    // 3. Video Playlist Logic (Haunted House - 기존 유지)
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
    // 4. 가상 악기(Synthesizer) 로직 - 파일 없이 소리 생성 (신규 적용)
    // --------------------------------------------------
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;
    let isPlaying = false;
    let noteInterval = null;

    const melody = [
        261.63, 329.63, 392.00, 493.88, // Cmaj7
        349.23, 440.00, 523.25, 659.25, // Fmaj7
        293.66, 349.23, 440.00, 587.33, // Dm7
        392.00, 493.88, 587.33, 783.99  // G7
    ];
    let currentNote = 0;

    function playTone() {
        if (!audioCtx) audioCtx = new AudioContext();
        
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'sine'; 
        oscillator.frequency.setValueAtTime(melody[currentNote], audioCtx.currentTime);
        
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 2);

        currentNote = (currentNote + 1) % melody.length;
    }

    // --------------------------------------------------
    // 5. Music Toggle 버튼 제어 (신규 적용)
    // --------------------------------------------------
    const musicBtn = document.getElementById('music-toggle');
    
    function toggleMusic() {
        if (!isPlaying) {
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            noteInterval = setInterval(playTone, 2000);
            isPlaying = true;
            if (musicBtn) {
                musicBtn.innerText = "🔊 Music Off";
                musicBtn.classList.add('playing');
            }
        } else {
            clearInterval(noteInterval);
            isPlaying = false;
            if (musicBtn) {
                musicBtn.innerText = "🎵 Music On";
                musicBtn.classList.remove('playing');
            }
        }
    }

    if (musicBtn) {
        musicBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMusic();
        });

        document.body.addEventListener('click', () => {
            if (!isPlaying) toggleMusic();
        }, { once: true });
    }

    // --------------------------------------------------
    // 6. Our Journey Movie (슬라이드쇼 로직 - 신규 적용)
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
            "앞으로도 더 많은 추억을 쌓아가요"
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
                        movieText.innerText = messages[messageIdx] || "우리의 이야기는 계속됩니다.";
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
    // 7. Gallery Modal 로직 (신규 적용 및 기존 유지)
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