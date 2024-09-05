// Diana Isabel Perez Hernandez 
var maximo, video, reproducir, barra, progreso, silenciar, volumen,
    bucle, tiempoActual, tracks, select, logo;

function iniciar() {
    maximo = 365; 
    video = document.getElementById("video");
    reproducir = document.getElementById("reproducir");
    barra = document.getElementById("barra");
    progreso = document.getElementById("progreso");
    silenciar = document.getElementById("silenciar");
    volumen = document.getElementById("volumen");
    tiempoActual = document.getElementById("tiempoAct");
    
    // Crear una instancia de la clase Logo
    logo = new Logo("panda");

    reproducir.addEventListener("click", presionar);
    silenciar.addEventListener("click", sonido);
    barra.addEventListener("click", mover);
    volumen.addEventListener("change", nivel);

    // Dibujar el panda inicialmente
    logo.drawPanda(colors1);
}

function presionar() {
    if (!video.paused && !video.ended) {
        video.pause();
        reproducir.value = ">";
        clearInterval(bucle);
        
        // Cambiar el panda a su color original cuando se pausa el video
        logo.drawPanda(colors1);
    } else {
        video.play();
        reproducir.value = "||";
        bucle = setInterval(estado, 1000);
        
        // Cambiar el color del panda cuando se reproduce el video
        logo.drawPanda(colors2);
    }
}

function estado() {
    if (!video.ended) {
        var largo = parseInt(video.currentTime * maximo / video.duration);
        progreso.style.width = largo + "px";
        tiempoActual.textContent = "" + parseFloat(video.currentTime.toFixed(2));
    } else {
        progreso.style.width = "0px";
        reproducir.value = ">";
        clearInterval(bucle);
        tiempoActual.textContent = "0";
    }
}

function mover(evento) {
    if (!video.paused && !video.ended) {
        var ratonX = evento.offsetX - 2;
        if (ratonX < 0) {
            ratonX = 0;
        } else if (ratonX > maximo) {
            ratonX = maximo;
        }
        var tiempo = ratonX * video.duration / maximo;
        video.currentTime = tiempo;
        progreso.style.width = ratonX + "px";
    }
}

function sonido() {
    if (silenciar.value == "Silencio") {
        video.muted = true;
        silenciar.value = "Sonido";
    } else {
        video.muted = false;
        silenciar.value = "Silencio";
    }
}

function nivel() {
    video.volume = volumen.value;
}

// Se agrega el listener para ejecutar la función iniciar al cargar la página
window.addEventListener("load", iniciar);

/* Logo en Canvas */
class Logo {
    constructor(panda) {
        this.canvasElement = document.getElementById(panda);
        this.canvas = this.canvasElement.getContext("2d");
    }

    drawCircle(x, y, radius, color1, color2) {
        const gradient = this.canvas.createRadialGradient(x, y, radius / 2, x, y, radius);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        
        this.canvas.beginPath();
        this.canvas.arc(x, y, radius, 0, Math.PI * 2);
        this.canvas.fillStyle = gradient;
        this.canvas.fill();
    }

    clearCanvas() {
        this.canvas.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    }

    drawPanda(colors) {
        this.clearCanvas();
        this.drawCircle(200, 200, 150, colors.background, colors.background); 

        // Cabeza
        this.drawCircle(200, 200, 100, colors.head1, colors.head2);

        // Ojos
        this.drawCircle(160, 170, 30, colors.eyes1, colors.eyes2);
        this.drawCircle(240, 170, 30, colors.eyes1, colors.eyes2);

        // Pupilas
        this.drawCircle(160, 170, 10, colors.pupils1, colors.pupils2);
        this.drawCircle(240, 170, 10, colors.pupils1, colors.pupils2);

        // Nariz
        this.drawCircle(200, 220, 20, colors.nose1, colors.nose2);

        // Orejas
        this.drawCircle(120, 100, 50, colors.ears1, colors.ears2);
        this.drawCircle(280, 100, 50, colors.ears1, colors.ears2);

        // Mejillas
        this.drawCircle(150, 240, 15, colors.cheeks1, colors.cheeks2);
        this.drawCircle(250, 240, 15, colors.cheeks1, colors.cheeks2);
    }
}

const colors1 = {
    background: '#800080',
    head1: '#ffffff',
    head2: '#d3d3d3',
    eyes1: '#000000',
    eyes2: '#333333',
    pupils1: '#ffffff',
    pupils2: '#bbbbbb',
    nose1: '#000000',
    nose2: '#333333',
    ears1: '#000000',
    ears2: '#333333',
    cheeks1: '#ff9999',
    cheeks2: '#ffcccc'
};

const colors2 = {
    background: '#004080',
    head1: '#ffccff',
    head2: '#ff99ff',
    eyes1: '#0000ff',
    eyes2: '#3333cc',
    pupils1: '#ffffff',
    pupils2: '#bbbbbb',
    nose1: '#0000ff',
    nose2: '#3333cc',
    ears1: '#0000ff',
    ears2: '#3333cc',
    cheeks1: '#ff99cc',
    cheeks2: '#ffccff'
};

