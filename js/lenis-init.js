/* ==========================================================================
   LENIS — scroll suave/cinematográfico em todo o site
   Por padrão, o navegador rola a página "aos pulos" a cada movimento da roda
   do mouse. O Lenis intercepta esse movimento e interpola suavemente até o
   destino, dando a sensação de rolagem contínua e mais lenta.
   Ele precisa ser "alimentado" a cada quadro de animação — por isso existe
   o requestAnimationFrame(raf) abaixo, rodando em loop enquanto a página
   estiver aberta.
   ========================================================================== */

const lenis = new Lenis({
    duration: 1.2,        // quanto maior, mais lenta/suave fica a rolagem
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // curva de desaceleração
    smoothWheel: true
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Faz os links com "#" (menu do header, botões da Hero, etc.) rolarem
// suavemente até a seção de destino usando o próprio Lenis, em vez do
// salto instantâneo padrão do navegador.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
        const destino = document.querySelector(link.getAttribute('href'));
        if (!destino) return;

        event.preventDefault();
        lenis.scrollTo(destino, { offset: -20 });
    });
});

// Botão "voltar ao topo": também usa o Lenis, para não brigar com a
// rolagem suave e criar um efeito de "trava" visual.
const botaoVoltarTopo = document.getElementById('btnTop');
if (botaoVoltarTopo) {
    botaoVoltarTopo.addEventListener('click', () => {
        lenis.scrollTo(0);
    });
}
