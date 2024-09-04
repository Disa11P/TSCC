// Diana Isabel Perez Hernandez 
var maximo, video , reproducir, barra, progreso, silenciar, volumen,
    bucle, tiempoActual, tracks, select;

function iniciar() {
    maximo = 365; video = document.getElementById("video");
    reproducir = document.getElementById("reproducir");
    barra = document.getElementById("barra");
    progreso = document.getElementById("progreso");
    silenciar = document.getElementById("silenciar");
    volumen = document.getElementById("volumen");
    tiempoActual = document.getElementById("tiempoAct");
    
    reproducir.addEventListener("click", presionar);
    silenciar.addEventListener("click", sonido);
    barra.addEventListener("click", mover);
    volumen.addEventListener("change", nivel);
}

function presionar() {
    if (!video.paused && !video.ended) {
        video.pause();
        reproducir.value = ">";
        clearInterval(bucle);
    } else {
        video.play();
        reproducir.value = "||";
        bucle = setInterval(estado, 1000);
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

/**
 * Maneja el evento de clic del mouse.
 * @param {MouseEvent} evento - El objeto del evento del mouse.
 */

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
        // Obtiene el contexto 2D del elemento canvas
        this.canvas = document.getElementById(panda).getContext("2d");
    }

    // Método para dibujar un círculo con degradado
    drawCircle(x, y, radius, color1, color2) {
        const gradient = this.canvas.createRadialGradient(x, y, radius / 2, x, y, radius);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        
        this.canvas.beginPath();
        this.canvas.arc(x, y, radius, 0, Math.PI * 2);
        this.canvas.fillStyle = gradient;
        this.canvas.fill();
    }
}

// Crear una instancia de la clase y dibujar el logo
const logo = new Logo("panda");

// Dibuja el círculo morado de fondo
logo.drawCircle(200, 200, 150, '#800080', '#800080'); 

// Dibuja el panda encima del círculo morado

// Cabeza
logo.drawCircle(200, 200, 100, '#ffffff', '#d3d3d3');

// Ojos
logo.drawCircle(160, 170, 30, '#000000', '#333333');
logo.drawCircle(240, 170, 30, '#000000', '#333333');

// Pupilas
logo.drawCircle(160, 170, 10, '#ffffff', '#bbbbbb');
logo.drawCircle(240, 170, 10, '#ffffff', '#bbbbbb');

// Nariz
logo.drawCircle(200, 220, 20, '#000000', '#333333');

// Orejas
logo.drawCircle(120, 100, 50, '#000000', '#333333');
logo.drawCircle(280, 100, 50, '#000000', '#333333');

// Mejillas
logo.drawCircle(150, 240, 15, '#ff9999', '#ffcccc');
logo.drawCircle(250, 240, 15, '#ff9999', '#ffcccc');