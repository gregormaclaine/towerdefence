class Bullet {
    constructor(tower, target) {
        this.tower = tower;
        this.target = target;

        this.pos = this.tower.pos.copy();
        this.speed = 10;

        this.hit = false;

        this.w = 4;
    }

    show() {
        stroke(0);
        strokeWeight(this.w);
        point(this.pos.x, this.pos.y);
    }

    update() {
        this.move();
        this.checkHit();
    }

    move() {
        let vel = this.target.pos.copy();
        vel.sub(this.pos);
        vel.limit(this.speed);
        this.pos.add(vel);
    }

    checkHit() {
        if (this.pos.dist(this.target.pos) <= this.w / 2 + this.target.hitRadius) {
            this.target.dead = true;
            this.tower.kills++;
            this.hit = true;
        }
    }
}