import React, { useEffect, useRef } from 'react';

const InfinityGlowBackground = ({ className = "", children }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);
  const trailRef = useRef([]);

  const params = useRef({
    speed: 1.0,
    size: 1.2,
    glowIntensity: 1.0,
    showTrail: true,
    maxTrailLength: 150
  });

  const initCanvas = (canvas) => {
    if (!canvas || !canvas.parentElement) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  };

  const getInfinityPosition = (t, canvas) => {
    const scale = Math.min(canvas.width, canvas.height) * 0.29;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Swap X and Y for vertical layout
    const y = centerY + scale * Math.cos(t) / (1 + Math.sin(t) * Math.sin(t));
    const x = centerX + scale * Math.sin(t) * Math.cos(t) / (1 + Math.sin(t) * Math.sin(t));

    return { x, y };
  };

  const drawGlowObject = (ctx, x, y, rotation, time) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    const baseSize = 30 * params.current.size;
    const pulseAmount = 0.8 + 0.2 * Math.sin(time * 5);
    const currentSize = baseSize * pulseAmount;

    for (let i = 0; i < 5; i++) {
      const glowSize = currentSize + (i * 8 * params.current.glowIntensity);
      const alpha = (0.1 - i * 0.02) * params.current.glowIntensity;
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
      gradient.addColorStop(0, `rgba(80, 80, 80, ${alpha})`);
      gradient.addColorStop(0.5, `rgba(80, 80, 80, ${alpha * 0.5})`);
      gradient.addColorStop(1, 'rgba(80, 80, 80, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(-glowSize, -glowSize / 3, glowSize * 2, glowSize * 2 / 3);
    }

    ctx.fillStyle = `rgba(100, 100, 100, ${0.9 * pulseAmount})`;
    ctx.fillRect(-currentSize / 2, -currentSize / 6, currentSize, currentSize / 3);

    ctx.fillStyle = `rgba(120, 120, 120, ${pulseAmount})`;
    ctx.fillRect(-currentSize / 3, -currentSize / 10, currentSize * 2 / 3, currentSize / 5);

    ctx.fillStyle = `rgba(150, 150, 150, ${pulseAmount})`;
    ctx.fillRect(-currentSize / 4, -1, currentSize / 2, 2);

    ctx.restore();
  };

  const updateTrail = (x, y) => {
    if (!params.current.showTrail) return;
    trailRef.current.push({ x, y, alpha: 1.0 });
    if (trailRef.current.length > params.current.maxTrailLength) {
      trailRef.current.shift();
    }
    trailRef.current.forEach((point, index) => {
      point.alpha = index / trailRef.current.length;
    });
  };

  const drawTrail = (ctx) => {
    if (!params.current.showTrail || trailRef.current.length < 2) return;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    for (let i = 1; i < trailRef.current.length; i++) {
      const current = trailRef.current[i];
      const previous = trailRef.current[i - 1];
      ctx.globalAlpha = current.alpha * 0.6;
      ctx.beginPath();
      ctx.moveTo(previous.x, previous.y);
      ctx.lineTo(current.x, current.y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;
  };

  const getRotationAngle = (t, canvas) => {
    const current = getInfinityPosition(t, canvas);
    const future = getInfinityPosition(t + 0.01, canvas);
    return Math.atan2(future.y - current.y, future.x - current.x);
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#f2f2f2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    timeRef.current += 0.02 * params.current.speed;
    const pos = getInfinityPosition(timeRef.current, canvas);
    const rotation = getRotationAngle(timeRef.current, canvas);

    updateTrail(pos.x, pos.y);
    drawTrail(ctx);
    drawGlowObject(ctx, pos.x, pos.y, rotation, timeRef.current);

    animationRef.current = requestAnimationFrame(animate);
  };

  const handleResize = () => {
    const canvas = canvasRef.current;
    if (canvas) initCanvas(canvas);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    initCanvas(canvas);
    animate();
    window.addEventListener('resize', handleResize);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        className={className}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          backgroundColor: '#f2f2f200',
          pointerEvents: 'none'
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  );
};

export default InfinityGlowBackground;