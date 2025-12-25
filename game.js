let musicBox = 100;
let battery = 100;
let currentHour = 0;
let currentCam = 11;
let isMaskOn = false;
let foxyFlashCount = 0;
let gameActive = false;

// Posições Iniciais e Caminhos
let positions = { 
    toyFreddy: "cam01", 
    toyChica: "cam02", 
    toyBonnie: "cam11", 
    foxy: "cam04" 
};

function startGame(night) {
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('game-container').classList.remove('hidden');
    gameActive = true;
    
    setInterval(() => {
        if(gameActive) {
            currentHour++;
            document.getElementById('hour-val').innerText = currentHour;
            if(currentHour === 6) victory();
        }
    }, 60000);

    // Loop de Movimentação Lento
    setInterval(gameLoop, 6000 - (night * 300)); 
}

function gameLoop() {
    if(!gameActive) return;

    musicBox -= 0.4;
    document.getElementById('music-val').innerText = Math.floor(musicBox);
    if(musicBox <= 0) gameOver("PUPPET SAIU!");

    if(Math.random() > 0.7) {
        // CAMINHO TOY CHICA: CAM 02 -> CAM 04 -> DUTO ESQUERDO
        if(positions.toyChica === "cam02") positions.toyChica = "cam04";
        else if(positions.toyChica === "cam04") positions.toyChica = "duct-left";

        // CAMINHO TOY BONNIE: CAM 11 -> CAM 03 -> DUTO DIREITO
        if(positions.toyBonnie === "cam11") positions.toyBonnie = "cam03";
        else if(positions.toyBonnie === "cam03") positions.toyBonnie = "duct-right";
        
        // TOY FREDDY: CAM 01 -> CORREDOR
        if(positions.toyFreddy === "cam01" && Math.random() > 0.8) positions.toyFreddy = "corridor";
        
        // FOXY: CAM 04 -> CORREDOR
        if(positions.foxy === "cam04") positions.foxy = "corridor";
        
        updateCamDetection();
    }
}

function playAudio() {
    let camStr = "cam" + (currentCam < 10 ? "0" + currentCam : currentCam);
    
    // Áudio atrai Toy Freddy de volta para a 01 se estiver perto
    if(positions.toyFreddy === "corridor" && currentCam === 1) {
        positions.toyFreddy = "cam01";
        alert("Freddy retornou à CAM 01");
    } 
    // Freddy se move entre 01, 02 e 03 seguindo o áudio
    else if(positions.toyFreddy === "cam01" && (currentCam === 2 || currentCam === 3)) {
        positions.toyFreddy = camStr;
        alert("Freddy seguiu o som");
    }

    // Toy Chica e Toy Bonnie também podem ser atraídos de volta se estiverem nas câmeras de caminho
    if(positions.toyChica === "cam04" && currentCam === 2) {
        positions.toyChica = "cam02";
        alert("Chica voltou para a CAM 02");
    }
    if(positions.toyBonnie === "cam03" && currentCam === 11) {
        positions.toyBonnie = "cam11";
        alert("Bonnie voltou para a CAM 11");
    }

    updateCamDetection();
}

function updateCamDetection() {
    let list = [];
    let camStr = "cam" + (currentCam < 10 ? "0" + currentCam : currentCam);
    for (let anim in positions) {
        if (positions[anim] === camStr) list.push(anim.toUpperCase());
    }
    document.getElementById('anim-detected').innerText = list.length > 0 ? "Detectado: " + list.join(", ") : "Área Limpa";
}

function changeCam(num) {
    currentCam = num;
    document.getElementById('cam-label').innerText = "CAM " + (num < 10 ? "0"+num : num);
    updateCamDetection();
}

document.getElementById('corridor').addEventListener('click', () => {
    let contents = [];
    if(positions.toyFreddy === "corridor") contents.push("Toy Freddy");
    if(positions.foxy === "corridor") contents.push("Foxy");
    alert(contents.length > 0 ? "Corredor: " + contents.join(" e ") : "Corredor Vazio");
});

document.getElementById('duct-left').addEventListener('click', () => {
    if(positions.toyChica === "duct-left") {
        if(isMaskOn) { alert("Chica recuou para a CAM 02."); positions.toyChica = "cam02"; }
        else gameOver("TOY CHICA TE PEGOU!");
    } else alert("Duto Esquerdo Limpo");
});

document.getElementById('duct-right').addEventListener('click', () => {
    if(positions.toyBonnie === "duct-right") {
        if(isMaskOn) { alert("Bonnie recuou para a CAM 11."); positions.toyBonnie = "cam11"; }
        else gameOver("TOY BONNIE TE PEGOU!");
    } else alert("Duto Direito: Toy Bonnie");
});

document.getElementById('flash-btn').addEventListener('click', () => {
    if(battery <= 0 || isMaskOn) return;
    battery -= 0.3;
    document.getElementById('bat-val').innerText = Math.floor(battery);
    if(positions.foxy === "corridor") {
        foxyFlashCount++;
        if(foxyFlashCount >= 2) { alert("Foxy recuou."); positions.foxy = "cam04"; foxyFlashCount = 0; }
    }
});

document.getElementById('mask-toggle').addEventListener('click', () => {
    isMaskOn = !isMaskOn;
    document.getElementById('office').classList.toggle('mask-active');
    if(isMaskOn) {
        document.getElementById('camera-screen').classList.add('hidden');
        document.getElementById('cam-menu').classList.add('hidden');
    }
});

document.getElementById('cam-toggle').addEventListener('click', () => {
    if(!isMaskOn) {
        document.getElementById('camera-screen').classList.toggle('hidden');
        document.getElementById('cam-menu').classList.toggle('hidden');
        updateCamDetection();
    }
});

document.getElementById('audio-btn').addEventListener('click', playAudio);

document.getElementById('rewind-btn').addEventListener('touchstart', (e) => {
    e.preventDefault();
    if(currentCam === 11 && musicBox < 100) musicBox += 7;
});

function gameOver(m) { alert(m); location.reload(); }
function victory() { alert("6 AM! VITÓRIA!"); location.reload(); }
