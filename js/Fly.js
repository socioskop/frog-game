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

    update(p1, p2) {
        // 1. Radar: Sense the tongues of both players
        const senseRange = 75; // How close the tongue gets before the fly panics
        const fleePower = 0.5;  // How much speed to add when fleeing
    
        [p1, p2].forEach(p => {
            if (p.state === "extending") {
                // Calculate where the tongue tip is currently
                const tx = p.x + Math.cos(p.angle * Math.PI / 180) * p.tongueLen;
                const ty = p.y + Math.sin(p.angle * Math.PI / 180) * p.tongueLen;
    
                const dist = Math.hypot(this.x - tx, this.y - ty);
    
                if (dist < senseRange) {
                    // Move AWAY from the tongue tip
                    const angleToTongue = Math.atan2(this.y - ty, this.x - tx);
                    this.vx += Math.cos(angleToTongue) * fleePower;
                    this.vy += Math.sin(angleToTongue) * fleePower;
                }
            }
        });
    
        // 2. Natural Jitter (Erratic movement)
        if (Math.random() < 0.05) {
            this.vx += (Math.random() - 0.5) * 2;
            this.vy += (Math.random() - 0.5) * 2;
        }
    
        // 3. Friction & Speed Limit (Prevents flies from flying off the screen at light speed)
        const maxSpeed = 3; 
        const speed = Math.hypot(this.vx, this.vy);
        if (speed > maxSpeed) {
            this.vx *= 0.95;
            this.vy *= 0.95;
        }
    
        this.x += this.vx;
        this.y += this.vy;
    
        // 4. Update Rotation Angle
        this.angle = Math.atan2(this.vy, this.vx) + Math.PI / 2;
    
        // 5. Screen Boundaries
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
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
    }
}
