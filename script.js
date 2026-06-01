let lokasiMaps = "";
let photoData = "";
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
function capturePhoto() {

    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const preview = document.getElementById("preview");

    if (!video.srcObject) {
        alert("Buka kamera terlebih dahulu");
        return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );

    photoData = canvas.toDataURL("image/jpeg", 0.9);

    preview.src = photoData;
    preview.style.display = "block";

    preview.scrollIntoView({
        behavior: "smooth"
    });

    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }

    video.style.display = "none";
}
function shareWA(){

    if(photoData === ""){

        alert(
        "Silakan foto bukti transfer terlebih dahulu!"
        );

        return;
    }

    if(lokasiMaps === ""){

        alert(
        "Silakan ambil lokasi GPS terlebih dahulu!"
        );

        return;
    }

    let cash =
    document.getElementById("cash").value || 0;

    let admin =
    document.getElementById("admin").value || 0;

    let penyetor =
    document.getElementById("penyetor").value || 0;

    let namaPenyetor =
    document.getElementById("namaPenyetor").value;

    let namaKonter =
    document.getElementById("namaKonter").value;

    let sisa =
    document.getElementById("sisaTF").innerText;

    let pesan =
`*SETORAN TUNAI*

💰 TOTAL CASH
Rp ${Number(cash).toLocaleString('id-ID')}

➖ ADMIN
Rp ${Number(admin).toLocaleString('id-ID')}

➖ PENYETOR
Rp ${Number(penyetor).toLocaleString('id-ID')}

✅ SISA TF
${sisa}

👤 NAMA PENYETOR
${namaPenyetor}

🏪 NAMA KONTER
${namaKonter}

📍 LOKASI
${lokasiMaps}

📷 Bukti transfer sudah difoto.`;

    window.open(
        "https://wa.me/?text=" +
        encodeURIComponent(pesan),
        "_blank"
    );
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

    document.getElementById("lokasi").innerHTML =
    "Lokasi belum diambil";

    document.getElementById("preview").src = "";
    document.getElementById("preview").style.display = "none";

    document.getElementById("video").style.display = "none";

    if(stream){
        stream.getTracks()
        .forEach(track=>track.stop());
    }

    lokasiMaps = "";
    photoData = "";
}
