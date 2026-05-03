// ============================
// Fungsi untuk pindah tampilan
// ============================
function showSection(sectionId) {
  document.getElementById("menuSection").classList.add("hidden");
  document.getElementById("backwardSection").classList.add("hidden");
  document.getElementById("newtonSection").classList.add("hidden");

  document.getElementById(sectionId).classList.remove("hidden");
}

function backToMenu() {
  document.getElementById("menuSection").classList.remove("hidden");
  document.getElementById("backwardSection").classList.add("hidden");
  document.getElementById("newtonSection").classList.add("hidden");
}

// ============================================
// Fungsi Evaluasi f(x) dari input string user
// ============================================
function evaluateFunction(funcStr, x) {
  try {
    let func = new Function("x", "return " + funcStr);
    return func(x);
  } catch (error) {
    return null;
  }
}

// =====================================
// METODE SELISIH MUNDUR (Backward Diff)
// =====================================
function calculateBackward() {
  const funcStr = document.getElementById("bwFunc").value.trim();
  const x = parseFloat(document.getElementById("bwX").value);
  const h = parseFloat(document.getElementById("bwH").value);

  const resultBox = document.getElementById("bwResult");

  if (funcStr === "" || isNaN(x) || isNaN(h)) {
    resultBox.classList.remove("hidden");
    resultBox.innerHTML = "<b>Error:</b> Semua input harus diisi!";
    return;
  }

  if (h === 0) {
    resultBox.classList.remove("hidden");
    resultBox.innerHTML = "<b>Error:</b> Nilai h tidak boleh 0!";
    return;
  }

  const fx = evaluateFunction(funcStr, x);
  const fxh = evaluateFunction(funcStr, x - h);

  if (fx === null || fxh === null) {
    resultBox.classList.remove("hidden");
    resultBox.innerHTML =
      "<b>Error:</b> Fungsi tidak valid! Pastikan format benar. Contoh: x*x + 3*x";
    return;
  }

  const derivative = (fx - fxh) / h;

  resultBox.classList.remove("hidden");
  resultBox.innerHTML = `
    <h3>Hasil Perhitungan</h3>
    <p><b>f(x)</b> = ${fx}</p>
    <p><b>f(x-h)</b> = ${fxh}</p>
    <p><b>f'(x) ≈</b> (f(x) - f(x-h)) / h</p>
    <p><b>Hasil f'(x)</b> = ${derivative}</p>
  `;
}

function resetBackward() {
  document.getElementById("bwFunc").value = "";
  document.getElementById("bwX").value = "";
  document.getElementById("bwH").value = "";
  document.getElementById("bwResult").classList.add("hidden");
  document.getElementById("bwResult").innerHTML = "";
}

// =====================================
// METODE NEWTON RAPHSON
// f'(x) dihitung dengan selisih mundur
// =====================================
function calculateNewtonRaphson() {
  const funcStr = document.getElementById("nrFunc").value.trim();
  const x0 = parseFloat(document.getElementById("nrX0").value);
  const tol = parseFloat(document.getElementById("nrTol").value);
  const maxIter = parseInt(document.getElementById("nrMaxIter").value);

  const resultBox = document.getElementById("nrResult");
  const tableContainer = document.getElementById("nrTableContainer");
  const tableBody = document.querySelector("#nrTable tbody");
  const infoBox = document.getElementById("nrInfoBox");

  // reset tampilan awal
  resultBox.classList.add("hidden");
  tableContainer.classList.add("hidden");
  infoBox.classList.add("hidden");

  tableBody.innerHTML = "";
  resultBox.innerHTML = "";
  infoBox.innerHTML = "";

  // validasi input
  if (funcStr === "" || isNaN(x0) || isNaN(tol) || isNaN(maxIter)) {
    alert("Harap isi semua input dengan benar!");
    return;
  }

  if (tol <= 0) {
    alert("Toleransi harus lebih dari 0!");
    return;
  }

  if (maxIter <= 0) {
    alert("Maksimum iterasi harus lebih dari 0!");
    return;
  }

  let x = x0;
  let h = 0.0001;
  let error = 0;
  let converged = false;

  let stopReason = "";

  for (let i = 1; i <= maxIter; i++) {
    let fx = evaluateFunction(funcStr, x);
    let fxh = evaluateFunction(funcStr, x - h);

    if (fx === null || fxh === null) {
      alert("Fungsi tidak valid! Contoh penulisan: x*x - 2");
      return;
    }

    // turunan numerik (selisih mundur)
    let fpx = (fx - fxh) / h;

    if (Math.abs(fpx) < 1e-12) {
      stopReason = "Metode gagal karena turunan mendekati nol";
      resultBox.classList.remove("hidden");
      resultBox.innerHTML = `
        <h3>Hasil Newton-Raphson</h3>
        <p><b>Status:</b> Gagal</p>
        <p><b>Alasan:</b> Turunan bernilai nol atau sangat kecil</p>
      `;

      infoBox.classList.remove("hidden");
      infoBox.innerHTML = `
        <div class="info-title">
          <div class="info-icon">i</div>
          <div>Info Error</div>
        </div>
        <p><b>Rumus Error:</b> Error = |x(n+1) - x(n)|</p>
        <p><b>${stopReason}</b></p>
      `;
      return;
    }

    let xNew = x - (fx / fpx);
    error = Math.abs(xNew - x);

    // masukkan ke tabel
    let row = `
      <tr>
        <td>${i}</td>
        <td>${x.toFixed(6)}</td>
        <td>${fx.toFixed(6)}</td>
        <td>${fpx.toFixed(6)}</td>
        <td>${xNew.toFixed(6)}</td>
        <td>${error.toFixed(6)}</td>
      </tr>
    `;
    tableBody.innerHTML += row;

    if (error < tol) {
      converged = true;
      stopReason = `Berhenti karena error < ${tol}`;
      x = xNew;
      break;
    }

    x = xNew;
  }

  resultBox.classList.remove("hidden");
  tableContainer.classList.remove("hidden");

  if (converged) {
    resultBox.innerHTML = `
      <h3>Hasil Newton-Raphson</h3>
      <p><b>Status:</b> Konvergen</p>
      <p><b>Akar pendekatan:</b> ${x.toFixed(6)}</p>
    `;
  } else {
    stopReason = `Berhenti karena mencapai maksimum iterasi (${maxIter})`;
    resultBox.innerHTML = `
      <h3>Hasil Newton-Raphson</h3>
      <p><b>Status:</b> Tidak Konvergen</p>
      <p><b>Hasil terakhir:</b> ${x.toFixed(6)}</p>
    `;
  }

  infoBox.classList.remove("hidden");
  infoBox.innerHTML = `
    <div class="info-title">
      <div class="info-icon">🔹</div>
      <div>Info Error</div>
    </div>
    <p><b>Rumus Error:</b> Error = |x(n+1) - x(n)| (absolute error)</p>
    <p><b>${stopReason}</b></p>
    <hr style="margin: 10px 0; border: none; border-top: 1px solid rgba(255,255,255,0.12);">
    <p><b>Catatan:</b> Iterasi dihentikan jika error lebih kecil dari toleransi atau mencapai iterasi maksimum.</p>
  `;
}

function resetNewton() {
  document.getElementById("nrFunc").value = "";
  document.getElementById("nrX0").value = "";
  document.getElementById("nrTol").value = "";
  document.getElementById("nrMaxIter").value = "";

  document.getElementById("nrResult").classList.add("hidden");
  document.getElementById("nrTableContainer").classList.add("hidden");
  document.getElementById("nrInfoBox").classList.add("hidden");

  document.querySelector("#nrTable tbody").innerHTML = "";
  document.getElementById("nrResult").innerHTML = "";
  document.getElementById("nrInfoBox").innerHTML = "";
}
function toggleGuide(id) {
  const box = document.getElementById(id);

  if (box.classList.contains("hidden")) {
    box.classList.remove("hidden");
  } else {
    box.classList.add("hidden");
  }
}