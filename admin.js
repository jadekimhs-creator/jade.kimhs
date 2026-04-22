import { supabase } from './supabaseClient.js';

const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const fileInput = document.getElementById('file-input');
const uploadBtn = document.getElementById('upload-btn');
const fileList = document.getElementById('file-list');
const uploadStatus = document.getElementById('upload-status');
const loginError = document.getElementById('login-error');

// Auth Listener
supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
        loginSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        loadFiles();
        loadGuestbook();
        loadRSVP();
        loadBGMPreview();
        loadWeddingSettings();
    } else {
        loginSection.classList.remove('hidden');
        dashboardSection.classList.add('hidden');
    }
});

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.textContent = '';
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) loginError.textContent = '로그인 실패: ' + error.message;
});

// Logout
logoutBtn.addEventListener('click', async () => {
    await supabase.auth.signOut();
});

// Upload Files
uploadBtn.addEventListener('click', async () => {
    const files = fileInput.files;
    if (files.length === 0) return alert('파일을 선택해주세요.');
    
    uploadStatus.textContent = '업로드 중...';
    for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error } = await supabase.storage.from('files').upload(filePath, file);
        if (error) {
            console.error(error);
            uploadStatus.textContent = '업로드 오류 발생: ' + error.message;
            return;
        }
    }
    uploadStatus.textContent = '업로드 완료!';
    fileInput.value = '';
    loadFiles();
});

// Delete File
async function deleteFile(path) {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const { error } = await supabase.storage.from('files').remove([path]);
    if (!error) loadFiles();
    else alert('삭제 오류: ' + error.message);
}

// BGM Upload
const bgmInput = document.getElementById('bgm-input');
const bgmUploadBtn = document.getElementById('bgm-upload-btn');
const bgmUploadStatus = document.getElementById('bgm-upload-status');
const bgmPreviewContainer = document.getElementById('bgm-preview-container');

bgmUploadBtn.addEventListener('click', async () => {
    const file = bgmInput.files[0];
    if (!file) return alert('MP3 파일을 선택해주세요.');
    
    bgmUploadStatus.textContent = 'BGM 업로드 중...';
    // 무조건 bgm.mp3 이름으로 덮어쓰기 (upsert: true)
    const { error } = await supabase.storage.from('files').upload('bgm/bgm.mp3', file, {
        upsert: true,
        cacheControl: '0'
    });
    
    if (error) {
        console.error(error);
        bgmUploadStatus.textContent = '업로드 오류 발생: ' + error.message;
        return;
    }
    
    bgmUploadStatus.textContent = 'BGM 업로드 완료!';
    bgmInput.value = '';
    loadBGMPreview();
});

// Load BGM Preview
async function loadBGMPreview() {
    const { data: publicUrlData } = supabase.storage.from('files').getPublicUrl('bgm/bgm.mp3');
    // cache busting query param to force reload the new file
    const audioUrl = publicUrlData.publicUrl + '?t=' + new Date().getTime();
    
    // Check if file exists by making a HEAD request or just putting it in the audio tag
    bgmPreviewContainer.innerHTML = `
        <audio controls style="width: 100%;">
            <source src="${audioUrl}" type="audio/mpeg">
            Your browser does not support the audio element.
        </audio>
        <button class="btn-delete-img" onclick="deleteFile('bgm/bgm.mp3'); setTimeout(loadBGMPreview, 1000);" style="margin-top: 10px;">BGM 삭제</button>
    `;
}

// 탭 전환 로직
document.querySelectorAll('.nav-item').forEach(btn => {
    if(btn.classList.contains('logout')) return;
    
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(btn.dataset.target).classList.add('active');
    });
});

// 전역 데이터 캐시 (Overview 업데이트용)
let counts = { photos: 0, guestbooks: 0, rsvpTotal: 0 };

function updateOverview() {
    document.getElementById('overview-photo-count').textContent = counts.photos;
    document.getElementById('overview-gb-count').textContent = counts.guestbooks;
    document.getElementById('overview-rsvp-count').textContent = counts.rsvpTotal;
}

// 갤러리 로드 (그리드 카드 형태)
async function loadFiles() {
    const { data, error } = await supabase.storage.from('files').list('uploads', {
        limit: 100, sortBy: { column: 'name', order: 'asc' }
    });
    
    fileList.innerHTML = '';
    if (error) return;
    
    const validFiles = data.filter(f => f.name !== '.emptyFolderPlaceholder');
    counts.photos = validFiles.length;
    updateOverview();

    if (validFiles.length === 0) {
        fileList.innerHTML = '<p style="color:#888; grid-column:1/-1;">업로드된 사진이 없습니다.</p>';
        return;
    }

    validFiles.forEach(file => {
        const { data: publicUrlData } = supabase.storage.from('files').getPublicUrl(`uploads/${file.name}`);
        
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.innerHTML = `
            <img src="${publicUrlData.publicUrl}" alt="gallery image">
            <div class="gallery-overlay">
                <button class="btn-delete-img" onclick="deleteFile('uploads/${file.name}')">삭제</button>
            </div>
        `;
        fileList.appendChild(div);
    });
}

// 방명록 로드 (카드 형태)
const adminGbList = document.getElementById('admin-guestbook-list');

async function loadGuestbook() {
    const { data, error } = await supabase.from('guestbook').select('*').order('created_at', { ascending: false });
    
    adminGbList.innerHTML = '';
    if (error) return;
    
    counts.guestbooks = data.length;
    updateOverview();

    if (data.length === 0) {
        adminGbList.innerHTML = '<p style="color:#888; grid-column:1/-1;">등록된 방명록이 없습니다.</p>';
        return;
    }

    data.forEach(item => {
        const date = new Date(item.created_at).toLocaleString('ko-KR');
        const div = document.createElement('div');
        div.className = 'gb-card';
        div.innerHTML = `
            <div class="gb-card-header">
                <div>
                    <div class="gb-card-name">${item.name}</div>
                    <div class="gb-card-date">${date}</div>
                </div>
            </div>
            <div class="gb-card-msg">${item.message}</div>
            <button class="btn-delete-gb" onclick="deleteGuestbook('${item.id}')">삭제</button>
            <div style="clear:both;"></div>
        `;
        adminGbList.appendChild(div);
    });
}


async function deleteGuestbook(id) {
    if (!confirm('방명록을 정말 삭제하시겠습니까?')) return;
    const { error } = await supabase.from('guestbook').delete().eq('id', id);
    if (!error) loadGuestbook();
    else alert('삭제 오류: ' + error.message);
}

// RSVP 관리
const adminRsvpList = document.getElementById('admin-rsvp-list');

async function loadRSVP() {
    const { data, error } = await supabase.from('rsvp').select('*').order('created_at', { ascending: false });
    
    adminRsvpList.innerHTML = '';
    if (error) return;

    let attendCount = 0;
    let companionTotal = 0;
    let absentCount = 0;

    data.forEach(item => {
        if (item.attend) {
            attendCount++;
            companionTotal += item.companion_count;
        } else {
            absentCount++;
        }

        const date = new Date(item.created_at).toLocaleDateString('ko-KR');
        const tr = document.createElement('tr');
        
        const statusBadge = item.attend ? '<span class="badge attend">참석</span>' : '<span class="badge absent">불참</span>';
        const companionStr = item.attend && item.companion_count > 0 ? `${item.companion_count}명` : '-';

        tr.innerHTML = `
            <td><strong>${item.name}</strong></td>
            <td>${statusBadge}</td>
            <td>${companionStr}</td>
            <td style="color:var(--text-muted);">${date}</td>
        `;
        adminRsvpList.appendChild(tr);
    });

    if (data.length === 0) {
        adminRsvpList.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px; color:#888;">아직 제출된 응답이 없습니다.</td></tr>';
    }

    // 통계 업데이트
    const totalExpected = attendCount + companionTotal;
    document.getElementById('rsvp-attend-count').textContent = attendCount;
    document.getElementById('rsvp-companion-count').textContent = companionTotal;
    document.getElementById('rsvp-total-count').textContent = totalExpected;
    document.getElementById('rsvp-absent-count').textContent = absentCount;
    
    counts.rsvpTotal = totalExpected;
    updateOverview();
}

window.deleteFile = deleteFile;
window.deleteGuestbook = deleteGuestbook;

// 웨딩 날짜 설정 (settings 테이블)
async function loadWeddingSettings() {
    const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'wedding_date')
        .single();

    const display = document.getElementById('current-wedding-date');
    const input = document.getElementById('wedding-date-input');

    if (!error && data) {
        const d = new Date(data.value);
        display.textContent = d.toLocaleString('ko-KR', { year:'numeric', month:'long', day:'numeric', weekday:'long', hour:'2-digit', minute:'2-digit' });
        // datetime-local input은 'YYYY-MM-DDTHH:mm' 형식
        const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        input.value = local;
    } else {
        display.textContent = '아직 설정된 날짜가 없습니다.';
    }
}

document.getElementById('save-wedding-date-btn').addEventListener('click', async () => {
    const input = document.getElementById('wedding-date-input');
    const status = document.getElementById('settings-status');
    const value = input.value;
    if (!value) { status.textContent = '날짜를 선택해주세요.'; return; }

    // ISO 형식으로 변환
    const isoDate = new Date(value).toISOString();

    const { error } = await supabase
        .from('settings')
        .upsert({ key: 'wedding_date', value: isoDate }, { onConflict: 'key' });

    if (error) {
        status.textContent = '저장 실패: ' + error.message;
    } else {
        status.textContent = '✅ 날짜가 성공적으로 저장되었습니다! 청첩장 D-Day가 자동 업데이트됩니다.';
        loadWeddingSettings();
    }
});
