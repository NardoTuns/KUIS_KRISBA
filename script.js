let soalList = [];
let waktu = 0;
let currentIndex = 0;
let timerInterval;

function mulaiKuis() {
  const nama = document.getElementById("nama").value;
  const kelas = document.getElementById("kelas").value;
  const pass = document.getElementById("password").value;

  if (pass !== "123") {
    alert("Password salah!");
    return;
  }

  fetch('Soal.txt')
    .then(response => response.text())
    .then(data => {
      soalList = parseSoal(data);
      waktu = soalList.waktu || 60;

      document.getElementById("login").style.display = "none";
      document.getElementById("kuis").style.display = "block";
      document.getElementById("waktu").textContent = waktu;

      tampilkanSoal(currentIndex);
      timerInterval = setInterval(() => {
        waktu--;
        document.getElementById("waktu").textContent = waktu;
        if (waktu <= 0) selesaiKuis();
      }, 1000);
    });
}

function parseSoal(data) {
  const lines = data.split('\n');
  const soalArray = [];
  let soalObj = {};
  lines.forEach(line => {
    if (line.startsWith("SOAL")) {
      if (Object.keys(soalObj).length > 0) soalArray.push(soalObj);
      soalObj = { soal: line, pilihan: {} };
    } else if (/^[A-D]\./.test(line)) {
      const opsi = line[0];
      soalObj.pilihan[opsi] = line.slice(2);
    } else if (line.startsWith("Kunci")) {
      soalObj.kunci = line.split(':')[1].trim();
    } else if (line.startsWith("Gambar")) {
      soalObj.gambar = line.split(':')[1].trim();
    } else if (line.startsWith("Waktu")) {
      soalArray.waktu = parseInt(line.split(':')[1].trim());
    }
  });
  soalArray.push(soalObj); // push terakhir
  return soalArray;
}

function tampilkanSoal(index) {
  const soalDiv = document.getElementById("soal-container");
  const s = soalList[index];
  if (!s) return;

  let html = `<h3>${s.soal}</h3>`;
  for (let opsi in s.pilihan) {
    html += `<label><input type="radio" name="soal${index}" value="${opsi}" /> ${opsi}. ${s.pilihan[opsi]}</label><br>`;
  }
  if (s.gambar) {
    html += `<img src="Gambar/${s.gambar}" alt="Gambar soal" />`;
  }

  soalDiv.innerHTML = html;
}

function selesaiKuis() {
  clearInterval(timerInterval);
  alert("Waktu habis atau selesai. Terima kasih!");
  // Di sini bisa disimpan hasil atau ditampilkan nilai
}
