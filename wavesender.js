class WaveSender {
    constructor(enemyPath, enemyImages) {
        this.path = enemyPath;
        this.enemyImages = enemyImages;

        this.wave = 1;
        this.current = null;

        this.active = false;

        this.sendButton = {
            x : 0,
            y : 0,
            w : width * 0.2,
            h : 20
        }
    }

    buttonContains(px, py) {
        return px >= this.sendButton.x && px < this.sendButton.x + this.sendButton.w &&
        py >= this.sendButton.y && py < this.sendButton.y + this.sendButton.h;
    }

    checkButton() {
        if (this.buttonContains(mouseX, mouseY) && !this.active) this.send();
    }

    send() {
        this.active = true;

        let count = this.wave * 3;
        let speed = 1;

        this.current = new Wave(count, speed, this.path, this.enemyImages);
    }

    showEnemies() {
        if (this.active) this.current.show();
    }

    showButton() {
        if (this.active) return;

        if (this.buttonContains(mouseX, mouseY)) cursor(HAND);
        fill(this.buttonContains(mouseX, mouseY) ? color(220, 220, 20) : color(255, 255, 55));

        stroke(0);
        strokeWeight(1);
        rect(this.sendButton.x, this.sendButton.y, this.sendButton.w, this.sendButton.h);
        fill(0);
        strokeWeight(0);
        textAlign(CENTER, CENTER)
        text("Next Wave (" + this.wave + ")", this.sendButton.x + this.sendButton.w / 2, this.sendButton.y + this.sendButton.h / 2);
    }

    update() {
        if (!this.active) return;
        this.current.update();
        if (this.current.done) {
            this.active = false;
            this.wave++;
        }
    }

    getDamage() {
        if (!this.current) return 0;
        return this.current.getDamage();
    }

    getPoints() {
        if (!this.current) return 0;
        return this.current.getPoints();
    }
}
