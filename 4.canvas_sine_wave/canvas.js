// import * as dat from 'dat.gui';

// const gui = new dat.GUI();

// const dat = require('dat.gui');

var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const wave = {
    y: canvas.height / 2,
    length: 0.01,
    amplitude: 100
}

// gui.add(wave, 'y', 0, canvas.height)
// gui.add(wave, 'length', -0.01, 0.01);
// gui.add(wave, 'amplitude', -300, 300);

function animate() {
    requestAnimationFrame(animate);
    c.beginPath();
    c.moveTo(0, canvas.height / 2);
    for (let i = 0; i < canvas.width; i++) {
        c.lineTo(i, canvas.height / 2 + Math.sin(i * 0.01) * 100);
    }
    c.stroke();
}

animate()