const ICON_PADDING = 10;

class ShopIcon {
    constructor(index, total, image, price) {
        this.index = index;
        this.image = image;
        this.price = price;

        this.calculatePos(total);
    }

    calculatePos(total) {
        // Rect
        this.w = 40;
        this.h = 40;

        let totalHeight = total * this.h + ICON_PADDING * (total - 1);

        let x = width - this.w / 2;
        let y = height / 2 - totalHeight / 2 + this.index * (this.h + ICON_PADDING) + this.h / 2;

        this.pos = createVector(x, y);

        // Image
        this.imWidth = 35;
        this.imHeight = this.image.height / (this.image.width / this.imWidth);
    }

    show() {
        push();

        translate(this.pos.x, this.pos.y)

        // Background
        rectMode(CENTER);
        stroke(0);
        strokeWeight(1);
        fill(this.contains(mouseX, mouseY) ? color(0, 200, 200) : color(0, 255, 255));
        if (this.contains(mouseX, mouseY)) cursor(HAND);
        rect(-0.5, 0, this.w - 1, this.h);

        // Image
        imageMode(CENTER);
        image(this.image, 0, -this.h * 0.2, this.imWidth, this.imHeight);

        // Text
        textSize(11);
        textAlign(CENTER, CENTER);
        strokeWeight(0);
        fill(0);
        text(this.price.toString(), 0, this.h * 0.2);
        
        pop();
    }

    contains(px, py) {
        return px >= this.pos.x - this.w / 2 && px < this.pos.x + this.w / 2 && 
            py >= this.pos.y - this.h / 2 && py < this.pos.y + this.h / 2;
    }
}