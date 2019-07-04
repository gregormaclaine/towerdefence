class Enemy {
    constructor(pathVectors, images, speed) {
        this.path = pathVectors;
        this.images = images;

        this.pos = this.path.splice(0, 1)[0];
        this.speed = speed ? speed : 1;

        this.damage = 10;
        this.points = 10;

        this.c = color(0, 255, 0);

        this.dead = false;
        this.won = false;

        this.counter = 0;
        this.imageChange = random(5, 10);

        this.hitRadius = 8;
    }

    show() {
        let i = this.images[floor(this.counter / this.imageChange) % 2];
        let w = i.width * 0.25;
        let h = i.height * 0.25;
        image(i, this.pos.x - w / 2, this.pos.y - h / 2, w, h);
    }

    move() {
        this.counter++;

        if (this.path.length <= 0) {
            this.won = true;
            return;
        }

        let vel = this.path[0].copy();
        vel.sub(this.pos)
        vel.limit(this.speed);
        this.pos.add(vel);
        if (this.pos.x == this.path[0].x && this.pos.y == this.path[0].y) {
            this.path.splice(0, 1);
        }
    }
}