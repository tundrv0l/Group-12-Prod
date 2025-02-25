import React, { useEffect, useRef } from 'react';
import { particleNetwork } from '../utils/particleNetwork'; // Adjust the import path as needed

/*
* Name: Background.js
* Author: Parker Clark
* Description: Component that establishes a background component for webpages.
*   Uses the particleNetwork function to create a particle network animation.
*/ 


const Background = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const animate = particleNetwork(canvas, ctx);
    const animationId = requestAnimationFrame(function loop() {
      animate();
      requestAnimationFrame(loop);
    });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} />;
};

export default Background;