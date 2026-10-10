import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DATA_EVENTO } from "../lib/cursos";

function calcular() {
  const diferenca = Math.max(0, DATA_EVENTO.getTime() - Date.now());
  const total = Math.floor(diferenca / 1000);

  return [
    { rotulo: "Dias", valor: String(Math.floor(total / 86400)).padStart(2, "0") },
    { rotulo: "Horas", valor: String(Math.floor((total % 86400) / 3600)).padStart(2, "0") },
    { rotulo: "Min", valor: String(Math.floor((total % 3600) / 60)).padStart(2, "0") },
    { rotulo: "Seg", valor: String(total % 60).padStart(2, "0") },
  ];
}

export function Contador() {
  const [tempo, setTempo] = useState(calcular);

  useEffect(() => {
    const intervalo = setInterval(() => setTempo(calcular()), 1000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="contador" role="timer" aria-label="Contagem regressiva para o evento">
      {tempo.map((t, i) => (
        <div key={t.rotulo} className="contador-bloco">
          <div className="contador-tempo">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.strong
                key={t.valor}
                initial={{ y: "-60%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "60%", opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                {t.valor}
              </motion.strong>
            </AnimatePresence>
            <span>{t.rotulo}</span>
          </div>
          {i < tempo.length - 1 && <span className="contador-separador">:</span>}
        </div>
      ))}
    </div>
  );
}
