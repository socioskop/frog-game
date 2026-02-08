import { Frog } from './Frog.js';
import { Fly }  from './Fly.js';
import { Wasp } from './Wasp.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const keys = {};
let isGameOver = false;

// 1. Initialize Players
// P1 (Left): Normal rotation
const p1 = new Frog(60, 540, "#4CAF50", { up: 'w', down: 's', fire: ' ' }, 1);
// P2 (Right): Inverted rotation for natural feel
const p2 = new Frog(1140, 540, "#2E7D32", { up: 'ArrowUp', down: 'ArrowDown', fire: 'Enter' }, -1);

// 2. Initialize Swarms
const flies = Array.from({ length: 6 }, () => new Fly(canvas.width, canvas.height));
const wasps = Array.from({ length: 3 }, () => new Wasp(canvas.width, canvas.height));

// 3. Input Listeners
window.onkeydown = (e) => keys[e.key] = true;
window.onkeyup = (e) => keys[e.key] = false;

// 4. The Core Game Loop
function gameLoop() {
    if (isGameOver) return;

    // Clear the stage
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and Draw Frogs
    [p1, p2].forEach((p, idx) => {
        p.update(keys);
        p.draw(ctx);

        // Calculate where the tip of the tongue is
        let tx = p.x + Math.cos(p.angle * Math.PI / 180) * p.tongueLen;
        let ty = p.y + Math.sin(p.angle * Math.PI / 180) * p.tongueLen;

        if (p.state === "extending") {
            // Check Fly Hits (Score Point)
            flies.forEach(f => {
                if (Math.hypot(f.x - tx, f.y - ty) < 25) {
                    p.score++;
                    f.reset();
                    p.state = "retracting";
                    updateUI();
                }
            });

            // Check Wasp Hits (Lose Life)
            wasps.forEach(w => {
              if (Math.hypot(w.x - tx, w.y - ty) < 20) {
                  p.lives--;
                  triggerDamageFlash(); // <-- Trigger the red flash here!
                  w.reset();
                  p.state = "retracting";
                  updateUI();
                  if (p.lives <= 0) {
                      endGame(idx === 0 ? "Mørkegrøn" : "Lysegrøn", "survival");
                  }
              }
            });
        }
        
        // Check for Score Win
        if (p.score >= 10) {
            endGame(idx === 0 ? "Lysegrøn" : "Mørkegrøn", "score");
        }
    });

    // Update and Draw Insects
    flies.forEach(f => { f.update(); f.draw(ctx); });
    wasps.forEach(w => { w.update(); w.draw(ctx); });

    requestAnimationFrame(gameLoop);
}

// 5. UI and End State Functions
function updateUI() {
    document.getElementById('s1').innerHTML = `P1: ${p1.score} <span style="font-size:14px">❤️ ${p1.lives}</span>`;
    document.getElementById('s2').innerHTML = `P2: ${p2.score} <span style="font-size:14px">❤️ ${p2.lives}</span>`;
}

function endGame(winner, reason) {
    isGameOver = true;
    const msg = reason === "score" ? "er mester-snapperen!" : "er den ultimative frø!";
    
    const overlay = document.createElement('div');
    overlay.className = "game-over-overlay"; 

    overlay.style = `
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.85);
        color: white;
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        border: 4px solid #4CAF50;
        z-index: 100;
    `;
    
    overlay.innerHTML = `
        <h1 style="font-size: 3rem; margin: 0;">🎉 ${winner} Vinder! 🎉</h1>
        <p>Fluerne er besejret!</p>
        <button onclick="location.reload()" style="
            padding: 10px 20px; 
            font-size: 1.2rem; 
            cursor: pointer; 
            background: #4CAF50; 
            color: white; 
            border: none; 
            border-radius: 5px;
        ">Spil igen?</button>
    `;
    
    document.body.appendChild(overlay);
    
    // Trigger confetti if available
    if (typeof confetti === 'function') {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        confetti({
            particleCount: 150,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#4CAF50', '#88ff88']
        });
        confetti({
            particleCount: 150,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#2E7D32', '#66bb66']
        });
    }
}

function triggerDamageFlash() {
    const flash = document.getElementById('damageFlash');
    
    // Remove the class in case it's already there (to restart the animation)
    flash.classList.remove('flash-hit');
    
    // Use a tiny timeout to "reset" the element so the browser sees the class add as a new event
    void flash.offsetWidth; // This is a "reflow" trick to restart CSS animations
    
    flash.classList.add('flash-hit');
}

// Start the game
gameLoop();