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

// Porta da cabana no viewBox da cena externa: o "alvo" da câmera.
const PORTA = "800 698";

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

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: secao.current,
              start: "top top",
              // Curto de propósito: pouco mais de uma tela de rolagem até entrar.
              end: "+=130%",
              pin: true,
              scrub: animar ? 0.9 : true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (st) => setNevando(st.progress < 0.62),
            },
          });

          const st = tl.scrollTrigger;
          registrarFimDaJornada(st ? () => st.end : null);

          if (animar) {
            tl.to(".hero-conteudo", { autoAlpha: 0, y: -90, duration: 0.18, ease: "power1.in" }, 0)
              .to(".dica-rolagem", { autoAlpha: 0, duration: 0.06 }, 0)
              .to(".camada-ceu", { scale: 1.08, svgOrigin: PORTA, duration: 0.7 }, 0)
              .to(".camada-montanhas", { scale: 1.3, svgOrigin: PORTA, duration: 0.7 }, 0)
              .to(".camada-distante", { scale: 2, svgOrigin: PORTA, duration: 0.7, ease: "power1.in" }, 0)
              .to(".camada-media", { scale: 4.5, svgOrigin: PORTA, duration: 0.62, ease: "power2.in" }, 0)
              .to(".camada-frente-esq", { x: -1000, scale: 1.7, svgOrigin: "0 900", duration: 0.5, ease: "power1.in" }, 0)
              .to(".camada-frente-dir", { x: 1000, scale: 1.7, svgOrigin: "1600 900", duration: 0.5, ease: "power1.in" }, 0)
              .to(".camada-chao", { y: 260, duration: 0.4, ease: "power1.in" }, 0)
              .to(".camada-cabana", { scale: 34, svgOrigin: PORTA, duration: 0.74, ease: "power3.in" }, 0)
              .to(".porta", { scaleX: 0.06, skewY: -4, svgOrigin: "782 698", duration: 0.2, ease: "power2.inOut" }, 0.34)
              .to(".cena-externa", { top: 0, duration: 0.45, ease: "power1.in" }, 0)
              .to(".fumaca", { autoAlpha: 0, duration: 0.1 }, 0.1)
              .to(".neve-canvas", { autoAlpha: 0, duration: 0.12 }, 0.5)
              .to(".clarao", { autoAlpha: 1, duration: 0.14, ease: "power1.in" }, 0.58)
              .fromTo(".sala", { autoAlpha: 0, scale: 1.14 }, { autoAlpha: 1, scale: 1, duration: 0.24, ease: "power2.out" }, 0.72)
              .to(".clarao", { autoAlpha: 0, duration: 0.2 }, 0.76)
              .from(".sala-titulo", { y: -40, autoAlpha: 0, duration: 0.12, ease: "power2.out" }, 0.84)
              .from(".presentes", { y: 70, autoAlpha: 0, duration: 0.12, ease: "back.out(1.6)" }, 0.86)
              .to({}, { duration: 0.06 });
          } else {
            tl.to(".hero-conteudo, .dica-rolagem", { autoAlpha: 0, duration: 0.3 }, 0)
              .to(".clarao", { autoAlpha: 1, duration: 0.3 }, 0.3)
              .set(".neve-canvas", { autoAlpha: 0 }, 0.6)
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
    <section className="jornada" ref={secao} id="inicio" aria-label="Floresta nevada e a cabana do FlashClip">
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
