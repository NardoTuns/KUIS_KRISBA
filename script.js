let soalList = [];
let waktu = 60;
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

      tampilkanSemuaSoal();

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
  let waktuSet = 60;

  lines.forEach(line => {
    if (line.startsWith("Waktu")) {
      waktuSet = parseInt(line.split(":")[1].trim());
    } else if (line.startsWith("SOAL")) {
      if (Object.keys(soalObj).length > 0) soalArray.push(soalObj);
      soalObj = { soal: line.substring(5).trim(), pilihan: {} };
    } else if (/^[A-D]\./.test(line)) {
      const opsi = line[0];
      soalObj.pilihan[opsi] = line.substring(3).trim();
    } else if (line.startsWith("Kunci")) {
      soalObj.kunci = line.split(':')[1].trim();
    } else if (line.startsWith("Gambar")) {
      soalObj.gambar = line.split(':')[1].trim();
    }
  });
  if (Object.keys(soalObj).length > 0) soalArray.push(soalObj);
  soalArray.waktu = waktuSet;
  return soalArray;
}

function tampilkanSemuaSoal() {
  const form = document.getElementById("formKuis");
  soalList.forEach((soal, index) => {
    const div = document.createElement("div");
    div.innerHTML = `<h3>${index + 1}. ${soal.soal}</h3>`;
    for (let opsi in soal.pilihan) {
      div.innerHTML += `
        <label>
          <input type="radio" name="soal${index}" value="${opsi}">
          ${opsi}. ${soal.pilihan[opsi]}
        </label><br>
      `;
    }
    if (soal.gambar) {
      div.innerHTML += `<img src="Gambar/${soal.gambar}" alt="Gambar Soal">`;
    }
    div.innerHTML += `<hr>`;
    form.appendChild(div);
  });
}

function selesaiKuis() {
  clearInterval(timerInterval);
  alert("Kuis selesai atau waktu habis. Terima kasih!");
  // Bisa ditambahkan fitur nilai, rekap, dll
}
