/* ==========================================================================
   HERO — animação de entrada com GSAP
   O título, subtítulo e botões começam com opacity: 0 e translateY(24px)
   (ver css/hero.css). Aqui usamos gsap.to() para levá-los até o estado
   final (opacity: 1, y: 0). O parâmetro "stagger" faz o GSAP animar cada
   elemento da seleção com um pequeno atraso em relação ao anterior — por
   isso o título aparece primeiro, depois o subtítulo, depois os botões,
   em vez de tudo surgir de uma vez.
   A animação só roda depois que o preloader termina, por isso escutamos
   o evento "preloaderComplete" (disparado em js/preloader.js).
   ========================================================================== */

document.addEventListener('preloaderComplete', function () {
    gsap.to('.hero_title, .hero_subtitle, .hero_actions', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.2 // 0.2s de espera entre a animação de um elemento e o próximo
    });
});
