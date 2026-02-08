export class Frog {
    constructor(x, y, color, controls, invert = 1) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.controls = controls;
	      this.invert = invert; // 1 for normal, -1 for inverted
	      this.lives = 3;
	      this.damageTimer = 0; // New property: 0 means healthy
        this.angle = (x < 400) ? 0 : 180;
        this.score = 0;
        this.tongueLen = 0;
        this.state = "idle";
    }

    update(keys) {
        // Aiming logic
        if (keys[this.controls.up]) this.angle -= (3 * this.invert);
        if (keys[this.controls.down]) this.angle += (3 * this.invert);

        // Firing logic
        if (keys[this.controls.fire] && this.state === "idle") this.state = "extending";

        if (this.state === "extending") {
            this.tongueLen += 30;
            if (this.tongueLen > 600) this.state = "retracting";
        } else if (this.state === "retracting") {
            this.tongueLen -= 30;
            if (this.tongueLen <= 0) { this.tongueLen = 0; this.state = "idle"; }
        }
    }

   draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle * Math.PI / 180);
    
        // 1. Draw the Tongue
        if (this.tongueLen > 0) {
            ctx.strokeStyle = "#ff7da1";
            ctx.lineWidth = 10;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(this.tongueLen, 0);
            ctx.stroke();
        }
    
        // 2. Draw the Frog Body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, 35, 25, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 3. DRAW THE EYES (Whites)
        const eyeOffsetX = 15;
        const eyeOffsetY = 12;
        ctx.fillStyle = "white";
        ctx.beginPath(); ctx.arc(eyeOffsetX, -eyeOffsetY, 8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(eyeOffsetX, eyeOffsetY, 8, 0, Math.PI * 2); ctx.fill();
    
        // 4. DRAW THE PUPILS OR SQUINT
        ctx.strokeStyle = "black";
        ctx.fillStyle = "black";
        ctx.lineWidth = 3;
    
        if (this.damageTimer > 0) {
            // SQUINT EFFECT: Draw horizontal lines
            ctx.beginPath();
            ctx.moveTo(eyeOffsetX - 4, -eyeOffsetY);
            ctx.lineTo(eyeOffsetX + 4, -eyeOffsetY);
            ctx.stroke();
    
            ctx.beginPath();
            ctx.moveTo(eyeOffsetX - 4, eyeOffsetY);
            ctx.lineTo(eyeOffsetX + 4, eyeOffsetY);
            ctx.stroke();
    
            this.damageTimer--; // Count down the timer every frame
        } else {
            // NORMAL PUPILS
            let pupilSize = (this.state === "extending") ? 6 : 4;
            ctx.beginPath();
            ctx.arc(eyeOffsetX + 3, -eyeOffsetY, pupilSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(eyeOffsetX + 3, eyeOffsetY, pupilSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 5. THE TINY HAT (Awarded at 5 points)
        if (this.score >= 5) {
            ctx.fillStyle = "#333"; // Dark gray/black for the hat
            
            // Hat Brim
            ctx.beginPath();
            ctx.roundRect(-10, -15, 20, 30, 5); // A small rounded rectangle for the brim
            ctx.fill();
    
            // Hat Top
            ctx.beginPath();
            ctx.fillRect(-5, -12, 15, 24); // The tall part of the top hat
            ctx.fill();
    
            // Optional: Red Ribbon on the hat
            ctx.fillStyle = "red";
            ctx.fillRect(5, -12, 3, 24); 
        }

    ctx.restore();
    }
}
