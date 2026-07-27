/* ==========================================================================
   AOS (Animate On Scroll)
   Biblioteca que observa os elementos com atributo "data-aos" no HTML e,
   quando eles entram na área visível da tela durante o scroll, adiciona uma
   classe que dispara a animação (ex: data-aos="fade-up" faz o elemento subir
   e aparecer). Só precisamos chamar AOS.init() uma vez — o resto é feito
   direto no HTML com os atributos data-aos / data-aos-delay.
   ========================================================================== */

AOS.init({
    duration: 700,   // duração de cada animação, em milissegundos
    easing: 'ease-out',
    once: true,       // anima só na primeira vez que o elemento entra na tela
    offset: 80        // roda a animação um pouco antes do elemento chegar no topo da tela
});
