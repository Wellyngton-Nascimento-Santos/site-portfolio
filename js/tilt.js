/* ==========================================================================
   TILT 3D — cards de "Como Eu Trabalho"
   Ao mover o mouse sobre um card, ele se inclina levemente na direção do
   cursor, como se estivesse "olhando" pra ele.

   A matemática por trás:
   1) Pegamos a posição do mouse DENTRO do card (em pixels).
   2) Convertemos isso pra um valor de 0 a 1 em cada eixo (0 = topo/esquerda,
      1 = base/direita, 0.5 = bem no centro).
   3) Subtraímos 0.5 e multiplicamos por 2, virando uma escala de -1 a 1 —
      assim, o centro do card vira "0" (sem inclinação) e as bordas viram
      "-1" ou "1" (inclinação máxima).
   4) Multiplicamos esse -1..1 pelo ângulo máximo desejado (INCLINACAO_MAXIMA)
      pra saber quantos graus rotacionar.

   O GSAP anima essa rotação suavemente a cada movimento (em vez de "pular"
   direto pro ângulo calculado), e devolve o card à posição normal quando o
   mouse sai (mouseleave).
   ========================================================================== */

const INCLINACAO_MAXIMA = 10; // graus — quanto maior, mais forte o tilt

document.querySelectorAll('.working_card').forEach((card) => {
    card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect();

        const posX = (event.clientX - rect.left) / rect.width;  // 0 a 1
        const posY = (event.clientY - rect.top) / rect.height;  // 0 a 1

        // Alimenta o spotlight (CSS, ver .working_card::before em style.css)
        // com a posição do mouse dentro do card, em porcentagem.
        card.style.setProperty('--mx', `${posX * 100}%`);
        card.style.setProperty('--my', `${posY * 100}%`);

        // Mouse na metade de cima inclina o card "pra trás" (rotateX positivo);
        // mouse na metade da direita inclina "pra a direita" (rotateY positivo).
        const rotateY = (posX - 0.5) * 2 * INCLINACAO_MAXIMA;
        const rotateX = (posY - 0.5) * -2 * INCLINACAO_MAXIMA;

        gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            y: -6, // pequena elevação, igual aos outros cards do site
            transformPerspective: 700,
            duration: 0.4,
            ease: 'power1.out'
        });
    });

    // Quando o mouse sai do card, volta tudo ao normal suavemente
    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
        });
    });
});
