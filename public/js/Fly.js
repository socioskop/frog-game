export class Fly {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        
        this.image = new Image();
        this.image.src = 'assets/Fly.png';
        
        this.size = 40;
        this.angle = 0; // Track the rotation angle
        this.reset();
    }

    update() {
        // 1. Add occasional random direction changes (The "Jitter")
        if (Math.random() < 0.05) { // 5% chance every frame to change course
            this.vx += (Math.random() - 0.5) * 2;
            this.vy += (Math.random() - 0.5) * 2;
        }

        // 2. Limit top speed so it doesn't go supersonic
        const maxSpeed = 5;
        const speed = Math.hypot(this.vx, this.vy);
        if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        }

        this.x += this.vx;
        this.y += this.vy;

        // 3. Calculate rotation angle based on velocity
        // We add Math.PI / 2 (90 degrees) if your PNG faces "up" by default
        this.angle = Math.atan2(this.vy, this.vx) + Math.PI / 2;

        // Bounce logic
        if (this.x < 0 || this.x > this.canvasWidth - this.size) this.vx *= -1;
        if (this.y < 0 || this.y > this.canvasHeight - 150) this.vy *= -1;
    }

    draw(ctx) {
        if (this.image.complete && this.image.naturalWidth !== 0) {
            ctx.save(); // Save current canvas state
            
            // Move to the fly's center, rotate, then draw
            ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
            ctx.rotate(this.angle);
            ctx.drawImage(this.image, -this.size / 2, -this.size / 2, this.size, this.size);
            
            ctx.restore(); // Restore state so other objects aren't rotated
        }
    }

    reset() {
        this.x = Math.random() * (this.canvasWidth - this.size);
        this.y = Math.random() * (this.canvasHeight - 200);
        this.vx = (Math.random() - 0.5) * 6;
        this.vy = (Math.random() - 0.5) * 6;
    }
}