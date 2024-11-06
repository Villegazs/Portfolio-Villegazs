// Variables del canvas
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

// Ajustar canvas al tamaño completo de la página
canvas.width = window.innerWidth;  // Mantener el ancho igual al de la ventana
canvas.height = document.documentElement.scrollHeight;  // Ajustar el alto al tamaño total de la página

// Posición del mouse (inicialmente fuera de la pantalla)
let mousePos = { x: -100, y: -100 };

// Límite máximo de partículas
const MAX_PARTICLES = 2000; // Cambia este valor según lo que necesites

// Clase para Partículas
class Particle {
    constructor(x, y) {
        this.pos = { x, y };
        this.vel = { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 };
        this.size = Math.random() * 5 + 1; // Tamaño inicial de la partícula
        this.alpha = 1;
    }

    update() {
        // Calcular la distancia del mouse a la partícula
        const dx = this.pos.x - mousePos.x;
        const dy = this.pos.y - mousePos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Si está dentro de un rango de distancia, aplicar la repulsión
        const maxRepulsionDistance = 100; // Distancia máxima de repulsión
        if (distance < maxRepulsionDistance) {
            // Fuerza de repulsión proporcional a la distancia (más fuerte cuando están cerca)
            const repulsionStrength = 0.1; // Ajusta la fuerza de repulsión
            const forceX = (dx / distance) * repulsionStrength;
            const forceY = (dy / distance) * repulsionStrength;

            // Aplicar la fuerza de repulsión a la velocidad de la partícula
            this.vel.x += forceX;
            this.vel.y += forceY;
        }

        // Actualizamos la posición de la partícula
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        // Rebote en los bordes
        if (this.pos.x <= 0 || this.pos.x >= canvas.width) this.vel.x *= -1;
        if (this.pos.y <= 0 || this.pos.y >= canvas.height) this.vel.y *= -1;

        this.alpha -= 0.0015; // Disminuir opacidad con el tiempo
    }

    draw() {
        // Determinar el color según la posición
        const color = this.getColor();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    getColor() {
        // Mapeo de colores según la posición de la partícula
        this.r = map(this.pos.x, 0, canvas.width, 0, 255); // Rojo según X
        this.g = map(this.pos.y, 0, canvas.height, 0, 255); // Verde según Y
        this.b = map(dist(canvas.width / 2, canvas.height / 2, this.pos.x, this.pos.y), 0, Math.min(canvas.width / 2, canvas.height / 2), 0, 255); // Azul según la distancia al centro

        // Retornar el color en formato RGBA con opacidad
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.alpha})`;
    }
}

// Función map() para interpolación lineal
function map(value, start1, stop1, start2, stop2) {
    return (value - start1) * (stop2 - start2) / (stop1 - start1) + start2;
}

// Función para calcular distancia
function dist(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Array para almacenar partículas
const particles = [];

// Generar partículas al azar
function spawnParticles() {
    if (particles.length < MAX_PARTICLES) { // Verificar límite
        for (let i = 0; i < 5; i++) {
            particles.push(new Particle(canvas.width / 2, canvas.height / 2));
        }
    }
}

// Variable para controlar el color de la palabra
let textColor = { r: 30, g: 30, b: 30 }; // Negro inicialmente
let targetColor = { r: 30, g: 30, b: 30 }; // Blanco
let colorSpeed = 0.05; // Velocidad de la animación de cambio de color

// Función para suavizar el cambio de color
function smoothColorTransition() {
    textColor.r += (targetColor.r - textColor.r) * colorSpeed;
    textColor.g += (targetColor.g - textColor.g) * colorSpeed;
    textColor.b += (targetColor.b - textColor.b) * colorSpeed;
}

// Función para dibujar la palabra "villegazs"
function drawText() {
    ctx.fillStyle = `rgb(${Math.floor(textColor.r)}, ${Math.floor(textColor.g)}, ${Math.floor(textColor.b)})`;
    ctx.font = '300px Titillium web';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText("Villegazs", canvas.width / 2, canvas.height / 2);
}

// Actualizar y dibujar partículas
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle, index) => {
        particle.update();
        particle.draw();

        // Eliminar partículas que se vuelven transparentes
        if (particle.alpha <= 0) {
            particles.splice(index, 1);
        }
    });

    // Actualizar color de texto con suavizado
    smoothColorTransition();

    // Dibujar el texto con el color suavizado
    drawText();

    spawnParticles(); // Generar nuevas partículas
    requestAnimationFrame(animate); // Animar de nuevo
}

// Iniciar animación
animate();

// Ajustar tamaño de canvas al redimensionar
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Detectar el evento de scroll para cambiar el color del texto
let scrollTimeout;
window.addEventListener('scroll', () => {
    // Mostrar el valor de scroll en la consola
    console.log(`Scroll Y: ${window.scrollY}`);

    // Cancelar el timeout anterior si el scroll continúa rápidamente
    clearTimeout(scrollTimeout);

    // Cambiar el color de la palabra después de un breve desplazamiento
    scrollTimeout = setTimeout(() => {
        // Si el scroll es mayor a una cierta cantidad (por ejemplo, 50px), cambiar el color del texto
        if (window.scrollY > 50) {
            targetColor = { r: 255, g: 255, b: 255 }; // Blanco
            console.log("Color cambiado a blanco"); // Log en consola
        } else {
            targetColor = { r: 30, g: 30, b: 30 }; // Negro
            console.log("Color original"); // Log en consola
        }
    }, 200); // Tiempo de espera antes de cambiar el color
});
// Evento para actualizar la posición del mouse
canvas.addEventListener('mousemove', (event) => {
    mousePos = {
        x: event.clientX,
        y: event.clientY
    };
});
