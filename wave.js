class Wave {
    constructor(count, speed, path, images) {
        this.count = count;
        this.speed = speed;
        this.spawned = 0;

        this.enemies = [];
        for (let i = 0; i < count; i++) {
            let p = [];
            path.forEach(v => p.push(v.copy()))
            setTimeout(() => this.spawn(p, images), i * 500)
        }

        this.damage = 0;
        this.points = 0;

        this.done = false;

    }

    spawn(path, images) {
        this.enemies.push(new Enemy(path, images, this.speed))
        this.spawned++;
    }

    getDamage() {
        let d = this.damage;
        this.damage = 0;
        return d;
    }

    getPoints() {
        let p = this.points;
        this.points = 0;
        return p;
    }

    update() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            let e = this.enemies[i];
            if (e.dead) {
                this.points += e.points;
                this.enemies.splice(i, 1);
                continue;
            }

            if (e.won) {
                this.damage += e.damage;
                this.enemies.splice(i, 1);
                continue;
            }
            e.move()
        }
        if (this.enemies.length == 0 && this.spawned == this.count) this.done = true;
    }

    show() {
        this.enemies.forEach(e => e.show());
    }
}
