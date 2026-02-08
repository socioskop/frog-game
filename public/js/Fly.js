export class Fly {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.reset();
    }

    // Move the fly and bounce off walls
    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce horizontally
        if (this.x < 10 || this.x > this.canvasWidth - 10) {
            this.vx *= -1;
        }
        // Bounce vertically (keep flies in the top 3/4 of the screen)
        if (this.y < 10 || this.y > this.canvasHeight - 100) {
            this.vy *= -1;
        }
    }

    // Draw the fly with simple wings
    draw(ctx) {
        ctx.fillStyle = "#222";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Wings
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.beginPath();
        ctx.ellipse(this.x - 5, this.y - 3, 5, 2, 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.x + 5, this.y - 3, 5, 2, -0.5, 0, Math.PI * 2);
        ctx.fill();
    }

    // Put the fly in a random new position
    reset() {
        this.x = Math.random() * (this.canvasWidth - 100) + 50;
        this.y = Math.random() * (this.canvasHeight - 200) + 50;
        // Random speed between -3 and 3
        this.vx = (Math.random() - 0.5) * 6;
        this.vy = (Math.random() - 0.5) * 6;
    }
}