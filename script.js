// Login Functionality
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const password = document.getElementById('password').value;
    
    if(password === '1234') {
        const nama = document.getElementById('nama').value;
        const kelas = document.getElementById('kelas').value;
        
        // Simpan data di sessionStorage
        sessionStorage.setItem('nama', nama);
        sessionStorage.setItem('kelas', kelas);
        
        // Redirect ke halaman kuis
        window.location.href = 'kuis.html';
    } else {
        alert('Password salah! Coba lagi.');
    }
});

// Kuis Functionality
if(window.location.pathname.includes('kuis.html')) {
    let soalData = [];
    let jawabanUser = {};
    let timeLeft = 30 * 60; // 30 menit
    
    // Ambil data peserta
    document.getElementById('nama-peserta').textContent = 
        `Peserta: ${sessionStorage.getItem('nama')} (${sessionStorage.getItem('kelas')})`;
    
    // Timer
    const timer = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('timer').textContent = 
            `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        
        if(timeLeft <= 0) {
            clearInterval(timer);
            submitJawaban();
        }
    }, 1000);
    
    // Load soal
    fetch('soal.txt')
        .then(response => response.text())
        .then(text => {
            soalData = parseSoal(text);
            tampilkanSoal(soalData);
        });
    
    // Parse soal dari text
    function parseSoal(text) {
        const soalBlocks = text.split('\n\n');
        return soalBlocks.map(block => {
            const lines = block.split('\n');
            const soal = {
                pertanyaan: lines[0].substring(3), // Hapus nomor soal
                pilihan: {},
                kunci: '',
                gambar: ''
            };
            
            for(let i = 1; i < lines.length; i++) {
                if(lines[i].startsWith('a.')) soal.pilihan.a = lines[i].substring(3);
                else if(lines[i].startsWith('b.')) soal.pilihan.b = lines[i].substring(3);
                else if(lines[i].startsWith('c.')) soal.pilihan.c = lines[i].substring(3);
                else if(lines[i].startsWith('d.')) soal.pilihan.d = lines[i].substring(3);
                else if(lines[i].startsWith('Kunci:')) soal.kunci = lines[i].substring(7).trim();
                else if(lines[i].startsWith('Gambar:')) soal.gambar = lines[i].substring(8).trim();
            }
            
            return soal;
        });
    }
    
    // Tampilkan soal
    function tampilkanSoal(soalData) {
        const container = document.getElementById('soal-container');
        
        soalData.forEach((soal, index) => {
            const soalElement = document.createElement('div');
            soalElement.className = 'soal';
            soalElement.innerHTML = `
                <h3>${index + 1}. ${soal.pertanyaan}</h3>
                ${soal.gambar ? `<img src="gambar/${soal.gambar}" alt="Gambar Soal" class="gambar-soal">` : ''}
                <div class="pilihan">
                    <label><input type="radio" name="soal${index}" value="a"> a. ${soal.pilihan.a}</label>
                    <label><input type="radio" name="soal${index}" value="b"> b. ${soal.pilihan.b}</label>
                    <label><input type="radio" name="soal${index}" value="c"> c. ${soal.pilihan.c}</label>
                    <label><input type="radio" name="soal${index}" value="d"> d. ${soal.pilihan.d}</label>
                </div>
            `;
            container.appendChild(soalElement);
        });
    }
    
    // Submit jawaban
    document.getElementById('submit-btn').addEventListener('click', submitJawaban);
    
    function submitJawaban() {
        clearInterval(timer);
        
        // Kumpulkan jawaban
        soalData.forEach((soal, index) => {
            const selected = document.querySelector(`input[name="soal${index}"]:checked`);
            jawabanUser[index] = selected ? selected.value : null;
        });
        
        // Hitung skor
        let skor = 0;
        soalData.forEach((soal, index) => {
            if(jawabanUser[index] === soal.kunci) {
                skor++;
            }
        });
        
        // Kirim ke Google Sheets
        kirimKeGoogleSheets(skor);
        
        // Tampilkan hasil (bisa dialihkan ke halaman hasil)
        alert(`Nama: ${sessionStorage.getItem('nama')}\nKelas: ${sessionStorage.getItem('kelas')}\nJawaban Benar: ${skor}/${soalData.length}`);
    }
    
    function kirimKeGoogleSheets(skor) {
        // Implementasi pengiriman ke Google Sheets
        // Anda perlu membuat Google Apps Script untuk ini
        const nama = sessionStorage.getItem('nama');
        const kelas = sessionStorage.getItem('kelas');
        
        // Contoh menggunakan fetch ke Google Apps Script Web App
        const scriptUrl = 'URL_GOOGLE_APPS_SCRIPT_DEPLOY_AS_WEB_APP';
        fetch(`${scriptUrl}?nama=${encodeURIComponent(nama)}&kelas=${encodeURIComponent(kelas)}&skor=${skor}`)
            .then(response => console.log('Data terkirim'))
            .catch(error => console.error('Error:', error));
    }
}
