const TOWER_RADIUS = 10

class Tower {
    constructor(pos, r, images) {
        this.pos = pos;
        this.r = r;
        this.images = images;

        this.shooting = false;
        this.shotTimemout = 1500;
        this.dir = createVector(0,0);

        this.bullets = [];
        this.kills = 0;
    }

    contains(px, py) {
        return this.pos.dist(createVector(px, py)) <= TOWER_RADIUS;    
    }

    update(enemies) {
        this.shoot(enemies);
        this.updateBullets();
    }

    show(active, centre) {
        let divisor = active ? 25 : 30;

        let i = this.shooting ? 1 : 0;
        let size = [this.images[i].width / divisor, this.images[i].height / divisor];

        if (active) {
            fill(0, 150);
            stroke(0, 150);
            strokeWeight(0.5);
            ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
        }

        if (this.contains(mouseX, mouseY)) cursor(HAND);

        strokeWeight(0.5);
        stroke(0);
        fill(active && !centre ? color(255, 0, 0) : color(200, 200))
        ellipse(this.pos.x, this.pos.y, TOWER_RADIUS * 2, TOWER_RADIUS * 2)

        push();
        imageMode(CENTER);
        translate(this.pos.x, this.pos.y);
        rotate(this.dir.heading());
        image(this.images[i], 0, 0, size[0], size[1]);
        pop();

        this.bullets.forEach(b => b.show());
    }

    inRadius(e) {
        return this.pos.dist(e.pos) <= this.r;
    }

    getTarget(enemies) {
        let options = enemies.filter(e => this.inRadius(e));
        if (options.length == 0) return;
        options.sort((a, b) => b.counter - a.counter);
        return options[0];
    }

    shoot(enemies) {
        if (this.shooting) return;

        // Get Target
        let t = this.getTarget(enemies);
        if (!t) return;

        // Aim
        this.dir = t.pos.copy();
        this.dir.sub(this.pos);
        this.dir.normalize();

        // Make Bullet
        let b = new Bullet(this, t)
        this.bullets.push(b);

        // Cooldown
        this.shooting = true;
        setTimeout(() => {this.shooting = false;}, this.shotTimemout);
    }

    updateBullets() {
        this.bullets = this.bullets.filter(b => !b.hit);
        this.bullets.forEach(b => b.update());
    }

    touchingPath(pv, pw) {
        // Check if Point is in Square
        if (pv.x - pw / 2 <= this.pos.x && this.pos.x < pv.x + pw / 2 &&
            pv.y - pw / 2 <= this.pos.y && this.pos.y < pv.y + pw / 2) return true;
        
        // Get Corners of Square
        let p1 = createVector(pv.x - pw / 2, pv.y - pw / 2);
        let p2 = createVector(pv.x + pw / 2, pv.y - pw / 2);
        let p3 = createVector(pv.x + pw / 2, pv.y + pw / 2);
        let p4 = createVector(pv.x - pw / 2, pv.y + pw / 2);

        [p1, p2, p3, p4].forEach(p => p.sub(this.pos));

        // Create Lines made of Two End Points
        return [
            [p1, p2],
            [p2, p3],
            [p3, p4],
            [p4, p1]
        ].some(([e1, e2]) => {
            // Start of Complex Maths
            let a = pow(e2.x - e1.x, 2) + pow(e2.y - e1.y, 2);
            let b = 2 * (e1.x * (e2.x - e1.x) + e1.y * (e2.y - e1.y));
            let c = pow(e1.x, 2) + pow(e1.y, 2) - pow(TOWER_RADIUS, 2);

            let disc = pow(b, 2) - 4 * a * c;
            if (disc <= 0) return false;
            
            let t1 = (-b + sqrt(disc)) / (2 * a);
            let t2 = (-b - sqrt(disc)) / (2 * a);
            return (0 < t1 && t1 < 1) || (0 < t2 && t2 < 1);
            // End of Complex Maths
        });
    }

    onScreen() {
        return this.pos.x >= TOWER_RADIUS && this.pos.x < width - (TOWER_RADIUS + 40) && this.pos.y >= 20 + TOWER_RADIUS && this.pos.y < height - TOWER_RADIUS;
    }
}
