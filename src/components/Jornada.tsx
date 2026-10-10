import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import { CenaExterna } from "./cena/CenaExterna";
import { Neve } from "./Neve";
import { Contador } from "./Contador";
import { Sala } from "./Sala";
import { registrarFimDaJornada, rolarPara } from "../lib/rolagem";
import type { Curso, MatriculaResumo } from "../lib/tipos";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Props {
  cursos: Curso[];
  carregando: boolean;
  demo: boolean;
  matriculas: MatriculaResumo[];
  onAbrir: (curso: Curso) => void;
}

// Porta da cabana no viewBox 1600×900: vão de 36×65 centrado em (800, 698).
// A cena usa "xMidYMax slice", então 1 unidade = max(W/1600, H/900) px.
function medirCena(cena: HTMLElement) {
  const W = cena.clientWidth;
  const H = cena.clientHeight;
  const s = Math.max(W / 1600, H / 900);
  return { W, H, s, cy: H - 202 * s };
}

/** Escala da cabana em que o vão da porta cobre a tela inteira. */
function escalaAtravessar(cena: HTMLElement) {
  const { W, H, s, cy } = medirCena(cena);
  return 1.1 * Math.max(cy / (32.5 * s), (H - cy) / (32.5 * s), W / 2 / (18 * s));
}

const entrada = {
  oculto: { opacity: 0, y: 24 },
  visivel: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.25 + i * 0.12, duration: 0.7, ease: "easeOut" as const } }),
};

export function Jornada(props: Props) {
  const secao = useRef<HTMLElement>(null);
  const [nevando, setNevando] = useState(true);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        { animar: "(prefers-reduced-motion: no-preference)", reduzir: "(prefers-reduced-motion: reduce)" },
        (contexto) => {
          const { animar } = contexto.conditions as { animar: boolean };

          const cena = secao.current!.querySelector<HTMLElement>(".cena-externa")!;
          const descida = () => {
            const { W, H } = medirCena(cena);
            return H * (W <= 760 ? 0.11 : 0.07);
          };

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: secao.current,
              start: "top top",
              // Curto de propósito: pouco mais de uma tela de rolagem até entrar.
              end: "+=150%",
              pin: true,
              scrub: animar ? 0.5 : true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (st) => {
                setNevando(st.progress < 0.6);
                // Pausa as animações contínuas da cena que não está à vista.
                secao.current!.dataset.cena = st.progress > 0.86 ? "dentro" : "fora";
              },
            },
          });

          const st = tl.scrollTrigger;
          registrarFimDaJornada(st ? () => st.end : null);

          if (animar) {
            // 1) aproximação: a câmera anda pela clareira e a floresta abre caminho
            tl.to(".hero-conteudo", { autoAlpha: 0, y: -80, duration: 0.16, ease: "power1.in" }, 0)
              .to(".dica-rolagem", { autoAlpha: 0, duration: 0.05 }, 0)
              .fromTo(".cena-externa", { y: descida }, { y: 0, duration: 0.5, ease: "power1.inOut" }, 0)
              .to(".camada-ceu", { scale: 1.06, duration: 0.6 }, 0)
              .to(".aurora", { autoAlpha: 0, duration: 0.3 }, 0.1)
              .to(".camada-montanhas", { scale: 1.18, duration: 0.6 }, 0)
              .to(".camada-distante", { scale: 1.7, duration: 0.6, ease: "power1.in" }, 0)
              .to(".camada-media", { scale: 2.8, duration: 0.5, ease: "power2.in" }, 0)
              .to(".camada-media", { autoAlpha: 0, duration: 0.1 }, 0.42)
              .to(".camada-frente-esq", { xPercent: -70, scale: 1.5, duration: 0.45, ease: "power1.in" }, 0)
              .to(".camada-frente-dir", { xPercent: 70, scale: 1.5, duration: 0.45, ease: "power1.in" }, 0)
              .to(".camada-chao", { yPercent: 30, duration: 0.35, ease: "power1.in" }, 0)
              .to(".camada-cabana", { scale: 3.2, duration: 0.45, ease: "power2.inOut" }, 0)
              .to(".fumaca", { autoAlpha: 0, duration: 0.1 }, 0.2)
              .to(".neve-canvas", { autoAlpha: 0, duration: 0.12 }, 0.45)
              // 2) a porta abre de verdade, girando na dobradiça
              .to(".porta-folha", { rotateY: 78, duration: 0.2, ease: "power2.inOut" }, 0.36)
              // 3) a câmera atravessa a porta e a luz quente toma a tela
              .to(".camada-cabana", { scale: () => escalaAtravessar(cena), duration: 0.3, ease: "power2.in" }, 0.56)
              .to(".clarao", { autoAlpha: 0.95, duration: 0.16, ease: "power1.in" }, 0.68)
              .set(".cena-externa", { autoAlpha: 0 }, 0.87)
              // 4) dentro da sala
              .fromTo(".sala", { autoAlpha: 0, scale: 1.15 }, { autoAlpha: 1, scale: 1, duration: 0.16, ease: "power2.out" }, 0.83)
              .to(".clarao", { autoAlpha: 0, duration: 0.14 }, 0.87)
              .from(".sala-titulo", { y: -30, autoAlpha: 0, duration: 0.08, ease: "power2.out" }, 0.92)
              .from(".presentes", { y: 50, autoAlpha: 0, duration: 0.08, ease: "power2.out" }, 0.93)
              .to({}, { duration: 0.04 });
          } else {
            tl.to(".hero-conteudo, .dica-rolagem", { autoAlpha: 0, duration: 0.3 }, 0)
              .to(".clarao", { autoAlpha: 1, duration: 0.3 }, 0.3)
              .set(".neve-canvas, .cena-externa", { autoAlpha: 0 }, 0.6)
              .fromTo(".sala", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 0.6)
              .to(".clarao", { autoAlpha: 0, duration: 0.3 }, 0.62);
          }

          return () => registrarFimDaJornada(null);
        },
      );
    },
    { scope: secao },
  );

  return (
    <section className="jornada" ref={secao} id="inicio" data-cena="fora" aria-label="Floresta nevada e a cabana do FlashClip">
      <div className="ceu" />
      <CenaExterna />
      <Neve ativa={nevando} />

      <div className="hero-conteudo">
        <motion.img
          src="./logo-transparente.png"
          alt="Logo do FlashClip"
          className="hero-logo"
          initial={{ opacity: 0, scale: 0.6, rotate: -30 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.p className="hero-categoria" variants={entrada} initial="oculto" animate="visivel" custom={0}>
          Edição de Natal · 2026/2
        </motion.p>
        <motion.h1 variants={entrada} initial="oculto" animate="visivel" custom={1}>
          FlashClip
        </motion.h1>
        <motion.p className="hero-subtitulo" variants={entrada} initial="oculto" animate="visivel" custom={2}>
          Uma cabana no meio da floresta, uma árvore cheia de presentes, e cada presente é uma linguagem
          de programação esperando por você.
        </motion.p>
        <motion.div variants={entrada} initial="oculto" animate="visivel" custom={3}>
          <Contador />
        </motion.div>
        <motion.div className="hero-acoes" variants={entrada} initial="oculto" animate="visivel" custom={4}>
          <button type="button" className="botao-principal" onClick={() => rolarPara("presentes")}>
            Entrar na cabana
          </button>
          <p className="hero-data-curta">05/12 às 14h · Ulbra Palmas, TO</p>
          <div className="hero-info">
            <span>
              <small>Local</small>
              Ulbra Palmas, TO
            </span>
            <span>
              <small>Data</small>
              05/12 às 14h
            </span>
          </div>
        </motion.div>
      </div>

      <div className="dica-rolagem" aria-hidden="true">
        <span className="dica-mouse" />
        Role para se aproximar
      </div>

      <div className="clarao" />

      <Sala {...props} />
    </section>
  );
}
