const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');

// position of the animation in the canvas
const centerX = canvas.width / 2; // 400
const centerY = canvas.height + 26; // 190

// radius of the animation in canvas
const radiusX = canvas.width / 2 - 200; // 300
const radiusY = canvas.height * 0.2; // 40

// fixed dot data
const fixedDots = [
    { label: 'A', angle: Math.PI / 1.2, glowing: false },
    { label: 'B', angle: Math.PI / 2, glowing: false },
    { label: 'C', angle: Math.PI / 6, glowing: false }
];

// oscillating blue dot
let oscillatingDot = { angle: Math.PI / 2, direction: 1 }; // Start at B, move toward C
let oscillatingSpeed = 0.02;
let stoppedTime = 0;
let glowThreshold = 0.1; // How close the blue dot should be before the red dot starts glowing

// Get the minimum and maximum angles from fixed dots A and C
const minAngle = Math.min(fixedDots[0].angle, fixedDots[2].angle);
const maxAngle = Math.max(fixedDots[0].angle, fixedDots[2].angle);

// drawing dot
function drawDot(x, y, color, label) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(label, x, y - 10);
}

function update() {
    // clears the previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw wide and flat semi-circle
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, Math.PI, 0);
    ctx.stroke();

    // Draw fixed dots
    fixedDots.forEach(dot => {
        const x = centerX + Math.cos(dot.angle) * radiusX;
        const y = centerY - Math.sin(dot.angle) * radiusY;
        drawDot(x, y, dot.glowing ? 'yellow' : 'red', dot.label);
    });

    // Update and draw oscillating dot
    if (stoppedTime > 0) {
        stoppedTime--; // Continue stopping if necessary
    } else {
        oscillatingDot.angle += oscillatingSpeed * oscillatingDot.direction;

        // Reverse direction if the dot reaches the endpoints (A or C)
        if (oscillatingDot.angle <= minAngle || oscillatingDot.angle >= maxAngle) {
            oscillatingDot.direction *= -1; // Reverse direction
            oscillatingDot.angle = Math.max(minAngle, Math.min(maxAngle, oscillatingDot.angle)); // Clamp the angle
        }

        // Check if the oscillating dot is near a fixed dot and glow if it is
        fixedDots.forEach(dot => {
            const angleDiff = Math.abs(dot.angle - oscillatingDot.angle);
            if (angleDiff < glowThreshold) {
                dot.glowing = true; // Make the dot glow when the blue dot is near
            } else {
                dot.glowing = false; // Stop glowing after moving away
            }

            if (angleDiff < oscillatingSpeed) {
                oscillatingDot.angle = dot.angle; // Snap to the fixed dot
                stoppedTime = 50; // Stop for a moment
            }
        });
    }

    // Draw the oscillating blue dot
    const oscX = centerX + Math.cos(oscillatingDot.angle) * radiusX;
    const oscY = centerY - Math.sin(oscillatingDot.angle) * radiusY;
    drawDot(oscX, oscY, 'blue', '');

    //browser API that tells the browser to schedule a function to run before the next repaint (refresh)
    requestAnimationFrame(update);
}

update();
