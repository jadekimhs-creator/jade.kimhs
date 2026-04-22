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

// Load Files
async function loadFiles() {
    const { data, error } = await supabase.storage.from('files').list('uploads', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
    });
    
    fileList.innerHTML = '';
    if (error) {
        console.error(error);
        return;
    }
    if (data.length === 0) {
        fileList.innerHTML = '<li>업로드된 파일이 없습니다.</li>';
        return;
    }

    data.forEach(file => {
        if (file.name === '.emptyFolderPlaceholder') return;
        const li = document.createElement('li');
        li.textContent = file.name;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '삭제';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = () => deleteFile(`uploads/${file.name}`);
        
        li.appendChild(deleteBtn);
        fileList.appendChild(li);
    });
}

// Delete File
async function deleteFile(path) {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const { error } = await supabase.storage.from('files').remove([path]);
    if (!error) loadFiles();
    else alert('삭제 오류: ' + error.message);
}

// 탭 전환 로직
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // 모든 탭 버튼 및 컨텐츠 비활성화
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // 클릭된 탭 활성화
        btn.classList.add('active');
        document.getElementById(btn.dataset.target).classList.add('active');
    });
});

// 방명록 관리
const adminGbList = document.getElementById('admin-guestbook-list');

async function loadGuestbook() {
    const { data, error } = await supabase.from('guestbook').select('*').order('created_at', { ascending: false });
    
    adminGbList.innerHTML = '';
    if (error) {
        console.error(error);
        return;
    }
    if (data.length === 0) {
        adminGbList.innerHTML = '<li>등록된 방명록이 없습니다.</li>';
        return;
    }

    data.forEach(item => {
        const date = new Date(item.created_at).toLocaleString('ko-KR');
        const li = document.createElement('li');
        li.style.flexDirection = 'column';
        li.style.alignItems = 'flex-start';
        li.style.gap = '10px';
        
        li.innerHTML = `
            <div style="width: 100%; display: flex; justify-content: space-between; align-items: center;">
                <strong>${item.name} <span style="font-size:0.8em; color:#888; font-weight:normal;">(${date})</span></strong>
            </div>
            <div style="width: 100%; white-space: pre-wrap; color: #444; font-size: 0.95em;">${item.message}</div>
        `;
        
        const headerDiv = li.querySelector('div');
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '삭제';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = () => deleteGuestbook(item.id);
        
        headerDiv.appendChild(deleteBtn);
        adminGbList.appendChild(li);
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
    if (error) {
        console.error(error);
        return;
    }

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
        
        const statusStr = item.attend ? '<span style="color:var(--primary);font-weight:bold;">참석</span>' : '<span style="color:#d9534f;">불참</span>';
        const companionStr = item.attend ? `${item.companion_count}명` : '-';

        tr.innerHTML = `
            <td><strong>${item.name}</strong></td>
            <td>${statusStr}</td>
            <td>${companionStr}</td>
            <td style="color:#888; font-size:0.9em;">${date}</td>
        `;
        adminRsvpList.appendChild(tr);
    });

    if (data.length === 0) {
        adminRsvpList.innerHTML = '<tr><td colspan="4" style="text-align:center;">아직 제출된 응답이 없습니다.</td></tr>';
    }

    // 통계 업데이트
    document.getElementById('rsvp-attend-count').textContent = attendCount;
    document.getElementById('rsvp-companion-count').textContent = companionTotal;
    document.getElementById('rsvp-total-count').textContent = attendCount + companionTotal;
    document.getElementById('rsvp-absent-count').textContent = absentCount;
}
