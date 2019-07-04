class TowerManager {
    constructor(images) {
        this.images = images;

        this.towers = [];
        this.active = -1;

        this.cash = 0;

        this.shopIcons = [];
        this.pseudoTower = null;
        this.iconSelected = -1;

        this.shopIcons.push(new ShopIcon(0, 1, this.images[0], 200))
    }

    getCash() {
        let c = this.cash;
        this.cash = 0;
        return c;
    }

    cancel() {
        this.pseudoTower = null;
        this.iconSelected = -1;
    }

    towerIsAllowed(paths, pathW) {
        return this.pseudoTower.onScreen() && paths.every(path => !this.pseudoTower.touchingPath(path, pathW));
    }

    drawShop(paths, pathW) {
        stroke(0);
        strokeWeight(1);
        fill(255);
        rect(width - 40, 0, 39, height - 1);

        this.shopIcons.forEach(i => i.show());

        if (this.iconSelected != -1) this.pseudoTower.pos = createVector(mouseX, mouseY);
        if (this.iconSelected != -1) this.pseudoTower.show(true, this.towerIsAllowed(paths, pathW));
    }

    drawCancel() {
        textAlign(CENTER, CENTER);
        textSize(20);
        strokeWeight(0.5);
        fill(255);
        stroke(200);
        text('Press Space to Cancel', width / 2, height - 20);
    }

    show(paths, pathW) {
        this.drawShop(paths, pathW);

        for (let i = 0; i < this.towers.length; i++) {
            this.towers[i].show(this.active == i);
        }

        if (this.iconSelected != -1) this.drawCancel();
    }

    handleClick(paths, pathW, cash) {
        if (this.iconSelected != -1) {
            if (this.towerIsAllowed(paths, pathW) && (cash + this.cash >= this.shopIcons[this.iconSelected].price)) {
                this.towers.push(this.pseudoTower);
                this.pseudoTower = null;
                this.cash -= this.shopIcons[this.iconSelected].price
                this.iconSelected = -1;
            }
            return;
        }

        for (let i = 0; i < this.shopIcons.length; i++) {
            if (this.shopIcons[i].contains(mouseX, mouseY)) {
                this.iconSelected = i;
                this.pseudoTower = new Tower(createVector(mouseX, mouseY), 75, this.images);
                return;
            }
        }

        for (let i = 0; i < this.towers.length; i++) {
            if (this.towers[i].contains(mouseX, mouseY)) {
                this.active = (this.active == i) ? -1 : i;
            }
        }
    }

    update(enemies) {
        this.towers.forEach(t => t.update(enemies));
    }
}