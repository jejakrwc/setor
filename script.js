let photoData = "";
let photoFile = null;
let stream = null;

function hitungSisaTF(){

    let cash = parseFloat(document.getElementById("cash").value) || 0;
    let admin = parseFloat(document.getElementById("admin").value) || 0;
    let penyetor = parseFloat(document.getElementById("penyetor").value) || 0;

    let hasil = cash - (admin + penyetor);

    document.getElementById("sisaTF").innerHTML =
        "Rp " + hasil.toLocaleString("id-ID");
}

document.querySelectorAll("#cash,#admin,#penyetor")
.forEach(el=>{
    el.addEventListener("input", hitungSisaTF);
});

async function startCamera() {

    try {

        const video =
        document.getElementById("video");

        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: {
                    ideal: "environment"
                }
            },
            audio: false
        });

        video.srcObject = stream;

        await video.play();

        video.style.display = "block";

    } catch (err) {

        console.error(err);

        alert(
            "Kamera tidak dapat dibuka. Pastikan izin kamera sudah diberikan."
        );
    }
}
async function capturePhoto() {

    const video =
    document.getElementById("video");

    const canvas =
    document.getElementById("canvas");

    const preview =
    document.getElementById("preview");

    if (!video.srcObject) {

        alert("Buka kamera terlebih dahulu");

        return;
    }

    if (
        video.videoWidth === 0 ||
        video.videoHeight === 0
    ) {

        alert("Tunggu kamera siap");

        return;
    }

    canvas.width =
    video.videoWidth;

    canvas.height =
    video.videoHeight;

    const ctx =
    canvas.getContext("2d");

    ctx.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );

    photoData =
    canvas.toDataURL(
        "image/jpeg",
        0.9
    );

    const blob =
    await new Promise(resolve =>
        canvas.toBlob(
            resolve,
            "image/jpeg",
            0.9
        )
    );

    photoFile =
    new File(
        [blob],
        "bukti-transfer.jpg",
        {
            type:"image/jpeg"
        }
    );

    /* MATIKAN KAMERA DULU */

    if (stream) {

        stream.getTracks()
        .forEach(track => track.stop());

        stream = null;
    }

    video.pause();
    video.srcObject = null;

    /* SEMBUNYIKAN VIDEO */

    video.style.display = "none";

    /* TAMPILKAN PREVIEW */

    preview.src = photoData;
    preview.style.display = "block";

    preview.style.width = "100%";

    preview.scrollIntoView({
        behavior:"smooth"
    });

}
async function shareWA() {

    if (!photoFile) {
        alert("Silakan ambil foto bukti transfer terlebih dahulu!");
        return;
    }

    let cash =
        parseFloat(document.getElementById("cash").value) || 0;

    let admin =
        parseFloat(document.getElementById("admin").value) || 0;

    let penyetor =
        parseFloat(document.getElementById("penyetor").value) || 0;

    let namaPenyetor =
        document.getElementById("namaPenyetor").value || "-";

    let namaKonter =
        document.getElementById("namaKonter").value || "-";

    let sisa =
        cash - (admin + penyetor);

    const now = new Date();

    const tanggal = now.toLocaleDateString("id-ID");

    const jam = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit"
    });

const pesan =
`

\`\`\`
          SETORAN TUNAI
================================

TANGGAL    : ${tanggal}
JAM        : ${jam}
KONTER     : ${namaKonter}

================================

TOTAL CASH : Rp ${cash.toLocaleString('id-ID').padStart(15,' ')}
ADMIN      : Rp ${admin.toLocaleString('id-ID').padStart(15,' ')}
PENYETOR   : Rp ${penyetor.toLocaleString('id-ID').padStart(15,' ')}
--------------------------------
SISA TF    : Rp ${sisa.toLocaleString('id-ID').padStart(15,' ')}

================================

PENYETOR   : ${namaPenyetor}

================================
        TERIMA KASIH
================================
\`\`\``;

    try {

        await navigator.share({
            title: "Setoran Tunai",
            text: pesan,
            files: [photoFile]
        });

    } catch (err) {

        console.error(err);

        alert(
            "Perangkat atau browser Anda tidak mendukung berbagi foto. Gunakan Chrome Android terbaru."
        );
    }
}

function resetForm(){

    document.querySelectorAll("input")
    .forEach(input=>{

        if(input.type !== "button"){
            input.value = "";
        }

    });

    document.getElementById("sisaTF").innerHTML =
    "Rp 0";


    document.getElementById("preview").src = "";
    document.getElementById("preview").style.display = "none";

    document.getElementById("video").style.display = "none";

    if(stream){
        stream.getTracks()
        .forEach(track=>track.stop());
    }

    photoData = "";
photoFile = null;
}

function updateProgress(){

    let total = 6;
    let done = 0;

    if(cash.value) done++;
    if(admin.value) done++;
    if(penyetor.value) done++;
    if(namaPenyetor.value) done++;
    if(namaKonter.value.trim()) done++;
    if(preview.src && preview.style.display !== "none") done++;

    let percent = Math.round(done / total * 100);

    progressFill.style.width = percent + "%";
    progressText.textContent = percent + "%";
    progressInfo.textContent = `${done} / ${total} Data Lengkap`;

}
document.querySelectorAll("input, select").forEach(el=>{
    el.addEventListener("input", updateProgress);
    el.addEventListener("change", updateProgress);
});

const fabMenu = document.getElementById("fabMenu");
const fabItems = document.getElementById("fabItems");

fabMenu.addEventListener("click", () => {

    fabMenu.classList.toggle("active");
    fabItems.classList.toggle("show");

});

const slides = document.querySelectorAll(".slide");
const steps = document.querySelectorAll(".step");

let current = 0;

function showSlide(index){

    slides.forEach(slide=>slide.classList.remove("active"));
    steps.forEach(step=>step.classList.remove("active"));

    slides[index].classList.add("active");

    for(let i=0;i<=index;i++){
        steps[i].classList.add("active");
    }

    prevBtn.style.visibility=index===0?"hidden":"visible";
    nextBtn.innerHTML=index===slides.length-1?
    'Selesai <i class="fa-solid fa-check"></i>':
    'Berikutnya <i class="fa-solid fa-arrow-right"></i>';

}

nextBtn.onclick=()=>{

    if(current<slides.length-1){

        current++;

        showSlide(current);

    }

}

prevBtn.onclick=()=>{

    if(current>0){

        current--;

        showSlide(current);

    }

}

showSlide(0);

function validSlide(index){

    switch(index){

        // Slide 1
        case 0:

            return (
                document.getElementById("namaPenyetor").value.trim() !== "" &&
                document.getElementById("namaKonter").value.trim() !== ""
            );

        // Slide 2
        case 1:

            return (
                document.getElementById("cash").value !== "" &&
                Number(document.getElementById("cash").value) > 0
            );

        // Slide 3
        case 2:

            return (
                document.getElementById("preview").style.display !== "none"
            );

    }

    return true;

}

