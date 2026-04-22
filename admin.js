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
