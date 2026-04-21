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
    // 4. 시네마틱 앰비언트 합성기 (파일 없이 분위기 연출 - 신규 적용)
    // --------------------------------------------------
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;
    let isPlaying = false;
    let intervalId = null;

    // 감성적인 코드 진행 (Cmaj7 - Am7 - Fmaj7 - G7sus4)
    const chords = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7 (도 미 솔 시)
        [220.00, 261.63, 329.63, 392.00], // Am7 (라 도 미 솔)
        [174.61, 220.00, 261.63, 329.63], // Fmaj7 (파 라 도 미)
        [196.00, 293.66, 392.00, 440.00]  // G7sus4 (솔 레 솔 라)
    ];
    let chordIdx = 0;

    function playCinematicChord() {
        if (!audioCtx) audioCtx = new AudioContext();
        
        const now = audioCtx.currentTime;
        const chord = chords[chordIdx];
        
        // 화음의 각 음을 부드럽게 생성
        chord.forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            // 부드러운 사인파와 삼각형파를 섞어 따뜻한 소리 구현
            osc.type = i === 0 ? 'triangle' : 'sine';
            osc.frequency.setValueAtTime(freq, now);

            // 볼륨 조절: 서서히 커졌다가 아주 길게 사라짐 (잔향 효과)
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.05, now + 1 + (i * 0.2)); 
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 6);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(now);
            osc.stop(now + 6);
        });

        chordIdx = (chordIdx + 1) % chords.length;
    }

    // --------------------------------------------------
    // 5. 음악 제어 버튼 (신규 적용)
    // --------------------------------------------------
    const musicBtn = document.getElementById('music-toggle');
    
    function startAmbientMusic() {
        if (!isPlaying) {
            if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
            playCinematicChord(); // 즉시 시작
            intervalId = setInterval(playCinematicChord, 4000); // 4초마다 코드 전환
            isPlaying = true;
            if (musicBtn) {
                musicBtn.innerText = "🔊 Music Off";
                musicBtn.classList.add('playing');
            }
        } else {
            clearInterval(intervalId);
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
            startAmbientMusic();
        });
        document.body.addEventListener('click', () => {
            if (!isPlaying) startAmbientMusic();
        }, { once: true });
    }

    // --------------------------------------------------
    // 6. 슬라이드쇼 및 갤러리 로직 (신규 적용)
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
            "더 많은 추억을 위해, 사랑합니다."
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