/*
* Name: particleNetwork.js
* Author: Umar Farooq, Modified by Parker Clark
* Description: Particle animations for the background of the page.
* NOTE: This original code is not the author's work. It is a modified version of the code from
*   https://github.com/umerfarok/animated-backgrounds. It is licensed under the MIT License.
* Param {HTMLCanvasElement} canvas - The canvas element
* Param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context
* Returns {Function} Animation loop function
*/

export const particleNetwork = (canvas, ctx) => {
  const particles = [];
  const particleCount = 60;
  const maxDistance = 120;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 1,
      vx: (Math.random() * 1.5 - 0.75) * 0.2, // Reduce velocity by a larger factor
      vy: (Math.random() * 1.5 - 0.75) * 0.2, // Reduce velocity by a larger factor
      color: `hsl(${Math.random() * 360}, 70%, 70%)`
    });
  }

  return () => {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / maxDistance})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  };
};