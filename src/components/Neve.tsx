import { useEffect, useRef } from "react";

interface Floco {
  x: number;
  y: number;
  r: number;
  vy: number;
  fase: number;
  amplitude: number;
  opacidade: number;
}

// Neve em canvas: leve, com profundidade (flocos maiores caem mais rápido).
export function Neve({ ativa = true }: { ativa?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ativaRef = useRef(ativa);
  ativaRef.current = ativa;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let flocos: Floco[] = [];
    let largura = 0;
    let altura = 0;
    let quadro = 0;

    const criar = (topo = false): Floco => {
      const r = 0.6 + Math.random() ** 2 * 2.8;
      return {
        x: Math.random() * largura,
        y: topo ? -10 : Math.random() * altura,
        r,
        vy: (reduzir ? 0.15 : 0.35) + r * (reduzir ? 0.1 : 0.32),
        fase: Math.random() * Math.PI * 2,
        amplitude: 0.3 + Math.random() * 0.8,
        opacidade: 0.35 + (r / 3.4) * 0.6,
      };
    };

    const redimensionar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      largura = canvas.clientWidth;
      altura = canvas.clientHeight;
      canvas.width = largura * dpr;
      canvas.height = altura * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const quantidade = Math.round(Math.min(220, (largura * altura) / (reduzir ? 26000 : 8500)));
      flocos = Array.from({ length: quantidade }, () => criar());
    };

    const desenhar = () => {
      quadro = requestAnimationFrame(desenhar);
      if (!ativaRef.current) return;

      ctx.clearRect(0, 0, largura, altura);
      ctx.fillStyle = "#fff";

      for (const f of flocos) {
        f.fase += 0.012;
        f.y += f.vy;
        f.x += Math.sin(f.fase) * f.amplitude * 0.5 + 0.15;

        if (f.y > altura + 10 || f.x > largura + 10) Object.assign(f, criar(true));

        ctx.globalAlpha = f.opacidade;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    redimensionar();
    desenhar();

    const observador = new ResizeObserver(redimensionar);
    observador.observe(canvas);

    return () => {
      cancelAnimationFrame(quadro);
      observador.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="neve-canvas" aria-hidden="true" />;
}
