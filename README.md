# FlashClip · Edição de Natal 🎄

Landing page do **FlashClip**, o evento da disciplina de Paradigmas de Linguagens de
Programação (Engenharia de Software, Ulbra Palmas) em que cada grupo ensina uma linguagem
para pessoas de dentro e de fora do curso.

A página é uma pequena jornada:

1. **Floresta nevada.** O hero mostra a contagem regressiva, com neve caindo, aurora e uma
   cabana iluminada no meio das árvores.
2. **Aproximação.** Ao rolar a página (cerca de 1,3 tela), a câmera atravessa a floresta em
   parallax até a cabana e a porta se abre.
3. **Dentro da cabana.** Depois de um clarão quente, aparece a sala com árvore de Natal,
   lareira acesa, mesa e janela. Cada **presente** embaixo da árvore é um curso (linguagem).
4. **Inscrição.** Clicar num presente abre um modal com os detalhes do curso. Dali a pessoa
   cria a conta (ou entra) e confirma a inscrição sem sair da página.

## Tecnologias

| Para quê | Biblioteca |
| --- | --- |
| Interface | React 19 + TypeScript + Vite |
| Animação ligada ao scroll (zoom, porta, transição) | GSAP + ScrollTrigger (`@gsap/react`) |
| Rolagem suave | Lenis |
| Microinterações (presentes, modal, contador, confete) | Framer Motion |
| Dados, login e inscrições | Supabase (o mesmo banco do site original) |

As cenas (floresta, cabana, árvore, lareira, presentes) são todas SVG desenhado em código,
sem imagens pesadas. A neve é um `<canvas>`. Quem usa `prefers-reduced-motion` recebe uma
versão sem zoom e sem animações contínuas.

## Rodando localmente

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # gera a pasta dist/
npm run preview   # serve o build
```

## Dados e regras de inscrição

Os presentes vêm da tabela `cursos` do Supabase, com os ministrantes. As regras são as
mesmas do site original:

- cadastro com nome e sobrenome, telefone com DDD, idade de 1 a 100, origem, e-mail e uma
  senha forte (8+ caracteres com 3 tipos, ou 12+ com 2 tipos);
- **uma inscrição por período** (`2026/02`);
- as vagas são conferidas direto no banco antes de inscrever.

Se o banco não responder, a cabana mostra presentes de exemplo e avisa que é uma prévia.
Nesse modo a inscrição fica desativada.

URL e chave do Supabase podem ser trocadas em um `.env` (veja `.env.example`).

## Estrutura

```
src/
  components/
    cena/          # SVGs: CenaExterna, Arvore, Lareira, Janela, Mesa
    Jornada.tsx    # timeline do scroll (floresta → porta → sala)
    Sala.tsx       # interior da cabana + presentes
    Presente.tsx   # presente animado (cada um é um curso)
    ModalInscricao.tsx / FormularioConta.tsx
  hooks/           # useCursos, useConta
  lib/             # supabase, regras de inscrição, cores das linguagens, rolagem
```

As cores de cada presente seguem a linguagem (Python azul e amarelo, Rust ferrugem etc.,
em `src/lib/linguagens.ts`). Linguagens desconhecidas recebem uma combinação natalina.

## Deploy

O workflow `.github/workflows/deploy.yml` publica no **GitHub Pages** a cada push na `main`.
Para ativar: *Settings → Pages → Build and deployment → Source: GitHub Actions*.
