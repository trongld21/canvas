const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Player {
    constructor() {

        this.velocity = {
            x: 0,
            y: 0
        }

        this.rotation = 0;

        const image = new Image();
        image.src = './img/spaceship.png';
        image.onload = () => {
            const scale = 0.15;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height
            }
        }

    }
    draw() {
        if (this.image) {
            c.save();
            c.translate(player.position.x + (player.width / 2), player.position.y + (player.height / 2));
            c.rotate(this.rotation);
            c.translate(-player.position.x + -(player.width / 2), -player.position.y + -(player.height / 2));
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
            c.restore();
        }
    }
    update() {
        if (this.image) {
            this.draw()
            this.position.x += this.velocity.x;
        }
    }
}

class Projectile {
    constructor(px, py, vx, vy) {
        this.position = {
            x: px,
            y: py
        };
        this.velocity = {
            x: vx,
            y: vy
        };
        this.radius = 3;
    }
    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'red';
        c.fill();
        c.closePath();
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Invader {
    constructor(px, py) {

        this.velocity = {
            x: 0,
            y: 0
        }

        const image = new Image();
        image.src = './img/invader.png';
        image.onload = () => {
            const scale = 1;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = {
                x: px,
                y: py
            }
        }

    }
    draw() {
        if (this.image) {
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }
    }
    update({ velocity }) {
        if (this.image) {
            this.draw()
            this.position.x += velocity.x;
            this.position.y += velocity.y;
        }
    }
}

class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }
        this.velocity = {
            x: 3,
            y: 10
        }
        this.invaders = []
        const rows = Math.floor(Math.random() * 10 + 5);
        const colums = Math.floor(Math.random() * 5 + 2);
        this.width = colums * 30;

        for (let x = 0; x < colums; x++) {
            for (let y = 0; y < rows; y++) {
                this.invaders.push(new Invader(x * 30, y * 30))
            }
        }

    }
    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.y = 0;
        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            console.log('to left')
            this.velocity.x *= -1;
            this.velocity.y = 10;
        }
    }
}

const player = new Player();
const projectiles = [];
const grids = [];
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    }
}
player.draw();

let frames = 0;
let randomInterval = Math.floor(Math.random() * 500 + 500);

function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();
    player.update();
    projectiles.forEach(projectile => {
        if (projectile.position.y + projectile.radius <= 0) {
            setTimeout(() => {
                projectile.splice(index, 1);
            }, 0)
        } else {
            projectile.update();
        }
    })
    grids.forEach(grid => {
        grid.update();
        grid.invaders.forEach(invander => {
            invander.update({ velocity: grid.velocity });
        })
    })
    if (keys.a.pressed && player.position.x >= 0) {
        player.velocity.x = -7;
        player.rotation = -0.15;
    } else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {
        player.velocity.x = 7;
        player.rotation = 0.15;
    } else {
        player.velocity.x = 0;
        player.rotation = 0;
    }
    if (frames % randomInterval === 0) {
        randomInterval = Math.floor(Math.random() * 500 + 500);
        console.log(randomInterval);
        grids.push(new Grid());
    }
    console.log(frames);

    frames++;
}

animate();

addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'a':
            console.log('left ' + key);
            keys.a.pressed = true;
            break;
        case 'd':
            console.log('right ' + key);
            keys.d.pressed = true;
            break;
        case ' ':
            console.log('space ' + key);
            projectiles.push(new Projectile(player.position.x + (player.width / 2), player.position.y, 0, -5))
            keys.space.pressed = true;
            break;
    }
})

addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'a':
            console.log('left');
            keys.a.pressed = false;
            break;
        case 'd':
            console.log('right');
            keys.d.pressed = false;
            break;
        case ' ':
            console.log('space');
            keys.space.pressed = false;
            break;
    }
})