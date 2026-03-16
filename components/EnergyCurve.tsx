import React, { useEffect, useRef, useCallback } from 'react';
import { ENERGY_CURVE, Icons } from '../constants';
import { getCurrentEnergy } from '../utils';
import { Task } from '../types';

interface EnergyCurveProps {
  tasks: Task[];
}

const PRIORITY_COLORS: Record<string, string> = {
  high: '#ff4d4d',
  medium: '#ffd93d',
  low: '#6bcb77',
};

const EnergyCurve: React.FC<EnergyCurveProps> = ({ tasks }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentEnergy = getCurrentEnergy();
  const currentHour = new Date().getHours();

  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const displayWidth = container.clientWidth;
    const displayHeight = 170;

    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    canvas.style.width = displayWidth + 'px';
    canvas.style.height = displayHeight + 'px';
    ctx.scale(dpr, dpr);

    const w = displayWidth;
    const h = displayHeight;
    ctx.clearRect(0, 0, w, h);

    const pad = { top: 30, right: 20, bottom: 28, left: 20 };
    const chartW = w - pad.left - pad.right;
    const chartH = h - pad.top - pad.bottom;

    const data = ENERGY_CURVE.filter(e => e.hour >= 5 && e.hour <= 22);
    const xScale = (hour: number) => pad.left + ((hour - 5) / 17) * chartW;
    const yScale = (energy: number) => pad.top + chartH - (energy / 100) * chartH;

    // Gradient fill
    const grad = ctx.createLinearGradient(0, pad.top, 0, h - pad.bottom);
    grad.addColorStop(0, 'rgba(255,149,0,0.18)');
    grad.addColorStop(1, 'rgba(255,149,0,0.01)');

    // Filled area
    ctx.beginPath();
    ctx.moveTo(xScale(data[0].hour), h - pad.bottom);
    data.forEach((d, i) => {
      if (i === 0) {
        ctx.lineTo(xScale(d.hour), yScale(d.energy));
      } else {
        const prev = data[i - 1];
        const cpx = (xScale(prev.hour) + xScale(d.hour)) / 2;
        ctx.bezierCurveTo(cpx, yScale(prev.energy), cpx, yScale(d.energy), xScale(d.hour), yScale(d.energy));
      }
    });
    ctx.lineTo(xScale(data[data.length - 1].hour), h - pad.bottom);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Curve line
    ctx.beginPath();
    data.forEach((d, i) => {
      if (i === 0) {
        ctx.moveTo(xScale(d.hour), yScale(d.energy));
      } else {
        const prev = data[i - 1];
        const cpx = (xScale(prev.hour) + xScale(d.hour)) / 2;
        ctx.bezierCurveTo(cpx, yScale(prev.energy), cpx, yScale(d.energy), xScale(d.hour), yScale(d.energy));
      }
    });
    ctx.strokeStyle = '#ff9500';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Hour labels along x-axis
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'center';
    [6, 9, 12, 15, 18, 21].forEach(hr => {
      const label = hr === 12 ? '12P' : hr < 12 ? hr + 'A' : (hr - 12) + 'P';
      ctx.fillText(label, xScale(hr), h - 6);
    });

    // Task markers on the curve
    tasks.forEach(t => {
      if (t.hour < 5 || t.hour > 22) return;
      const tx = xScale(t.hour);
      // Interpolate energy at task hour
      const sorted = [...ENERGY_CURVE].sort((a, b) => a.hour - b.hour);
      let prev2 = sorted[0];
      let next2 = sorted[sorted.length - 1];
      for (let i = 0; i < sorted.length - 1; i++) {
        if (sorted[i].hour <= t.hour && sorted[i + 1].hour > t.hour) {
          prev2 = sorted[i];
          next2 = sorted[i + 1];
          break;
        }
      }
      const tRatio = (t.hour - prev2.hour) / (next2.hour - prev2.hour);
      const tEnergy = prev2.energy + tRatio * (next2.energy - prev2.energy);
      const ty = yScale(tEnergy) - 10;
      const color = PRIORITY_COLORS[t.priority] || '#fff';
      ctx.beginPath();
      ctx.arc(tx, ty, t.done ? 3 : 4, 0, Math.PI * 2);
      ctx.fillStyle = t.done ? 'rgba(255,255,255,0.2)' : color;
      ctx.fill();
      if (!t.done) {
        ctx.strokeStyle = color + '60';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    // Current-time indicator
    if (currentHour >= 5 && currentHour <= 22) {
      const cx = xScale(currentHour);
      const cy = yScale(currentEnergy.energy);
      // Vertical dashed line
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(cx, pad.top);
      ctx.lineTo(cx, h - pad.bottom);
      ctx.strokeStyle = 'rgba(255,149,0,0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
      // Dot
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#ff9500';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [tasks, currentHour, currentEnergy]);

  useEffect(() => {
    drawChart();
    window.addEventListener('resize', drawChart);
    return () => window.removeEventListener('resize', drawChart);
  }, [drawChart]);

  return (
    <div ref={containerRef} className="relative w-full">
      <canvas ref={canvasRef} className="w-full block" style={{ height: 170 }} />
      <div className="absolute top-0 left-0 flex items-center gap-2 text-[11px] text-white/40">
        <span className="text-orange-400">{Icons.zap}</span>
        <span>{currentEnergy.energy}% — {currentEnergy.label}</span>
      </div>
    </div>
  );
};

export default EnergyCurve;
