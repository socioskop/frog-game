export class Frog {
    constructor(x, y, color, controls, invert = 1) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.controls = controls;
	      this.invert = invert; // 1 for normal, -1 for inverted
	      this.lives = 3;
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
        // Tongue
        ctx.strokeStyle = "#ffafcc";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
            this.x + Math.cos(this.angle * Math.PI / 180) * this.tongueLen,
            this.y + Math.sin(this.angle * Math.PI / 180) * this.tongueLen
        );
        ctx.stroke();

        // Frog Body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 25, 0, Math.PI * 2);
        ctx.fill();
    }
}
