import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let fimDaJornada: (() => number) | null = null;

/** Rolagem suave (Lenis) sincronizada com o ScrollTrigger do GSAP. */
export function iniciarRolagemSuave(): () => void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);

  const tique = (tempo: number) => lenis?.raf(tempo * 1000);
  gsap.ticker.add(tique);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tique);
    lenis?.destroy();
    lenis = null;
  };
}

export function travarRolagem(travar: boolean) {
  if (lenis) {
    if (travar) lenis.stop();
    else lenis.start();
  }
  document.documentElement.classList.toggle("rolagem-travada", travar);
}

export function registrarFimDaJornada(obter: (() => number) | null) {
  fimDaJornada = obter;
}

export function rolarPara(destino: "inicio" | "presentes" | string) {
  let alvo: number | string = 0;

  if (destino === "presentes") alvo = fimDaJornada ? fimDaJornada() : "#presentes";
  else if (destino !== "inicio") alvo = destino;

  if (lenis) {
    lenis.scrollTo(alvo, { duration: destino === "presentes" ? 2.2 : 1.2, offset: typeof alvo === "string" ? -70 : 0 });
    return;
  }

  if (typeof alvo === "number") window.scrollTo({ top: alvo, behavior: "smooth" });
  else document.querySelector(alvo)?.scrollIntoView({ behavior: "smooth" });
}
