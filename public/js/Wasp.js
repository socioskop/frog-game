export class Wasp {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.reset();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 10 || this.x > this.canvasWidth - 10) this.vx *= -1;
        if (this.y < 10 || this.y > this.canvasHeight - 150) this.vy *= -1;
    }

    draw(ctx) {
        // Body (Yellow and Black stripes)
        ctx.fillStyle = "#FFD700"; // Gold/Yellow
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, 10, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Stripes
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(this.x - 3, this.y - 5); ctx.lineTo(this.x - 3, this.y + 5); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(this.x + 3, this.y - 5); ctx.lineTo(this.x + 3, this.y + 5); ctx.stroke();

        // Stinger
        ctx.beginPath(); ctx.moveTo(this.x + 10, this.y); ctx.lineTo(this.x + 15, this.y); ctx.stroke();
    }

    reset() {
        this.x = Math.random() * (this.canvasWidth - 100) + 50;
        this.y = Math.random() * (this.canvasHeight - 200) + 50;
        this.vx = (Math.random() - 0.5) * 10; // Faster than flies!
        this.vy = (Math.random() - 0.5) * 10;
    }
}