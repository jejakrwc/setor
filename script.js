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
async function shareWA(){

    if(!photoFile){

        alert(
        "Silakan foto bukti transfer terlebih dahulu!"
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
`🧾 *SETORAN TUNAI*

\`\`\`
========================
TOTAL CASH : Rp ${Number(cash).toLocaleString('id-ID')}
ADMIN      : Rp ${Number(admin).toLocaleString('id-ID')}
PENYETOR   : Rp ${Number(penyetor).toLocaleString('id-ID')}
------------------------
SISA TF    : ${sisa}
========================

NAMA       : ${namaPenyetor}
KONTER     : ${namaKonter}
\`\`\`

📸 Bukti transfer terlampir`;

    try{

        if(
            navigator.canShare &&
            navigator.canShare({
                files:[photoFile]
            })
        ){

            await navigator.share({
                title:"Setoran Tunai",
                text:pesan,
                files:[photoFile]
            });

        }else{

            window.open(
                "https://wa.me/?text=" +
                encodeURIComponent(pesan),
                "_blank"
            );

        }

    }catch(err){

        console.error(err);

        alert("Gagal membagikan data.");
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
