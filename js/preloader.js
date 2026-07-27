/* ==========================================================================
   PRELOADER
   Duas animações acontecem "ao mesmo tempo" enquanto a página carrega:
     1) Um efeito de terminal digitando frases, uma após a outra.
     2) Um contador de 0% a 100% (animado com GSAP) que também preenche
        a barra de progresso fina abaixo do número.
   Quando o contador chega a 100%, o preloader some com um fade (GSAP) e
   dispara o evento "preloaderComplete" — é esse evento que a Hero escuta
   para só então começar a sua própria animação de entrada.
   ========================================================================== */

(function () {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    // Trava o scroll da página enquanto o preloader estiver visível
    document.body.classList.add('preloader-lock');

    // ---- 1) Efeito de terminal digitando ----
    const linhas = [
        '> Carregando portfólio...',
        '> Compilando experiência...',
        '> Pronto.'
    ];
    const elLinha = document.getElementById('preloaderLine');

    // Digita "texto" letra por letra dentro de elLinha e chama callback ao terminar
    function digitarLinha(texto, callback) {
        let i = 0;
        elLinha.textContent = '';
        const intervalo = setInterval(() => {
            elLinha.textContent += texto[i];
            i++;
            if (i >= texto.length) {
                clearInterval(intervalo);
                setTimeout(callback, 450); // pequena pausa antes de trocar de linha
            }
        }, 45); // velocidade da digitação (ms por letra)
    }

    // Roda a lista de linhas em loop (recomeça do início) enquanto a barra carrega
    function cicloDeLinhas(index) {
        digitarLinha(linhas[index], () => {
            const proximaLinha = (index + 1) % linhas.length;
            cicloDeLinhas(proximaLinha);
        });
    }
    cicloDeLinhas(0);

    // ---- 2) Contador de 0% a 100%, animado com GSAP ----
    const elPercent = document.getElementById('preloaderPercent');
    const elBarFill = document.getElementById('preloaderBarFill');

    // Objeto "falso" que existe só para o GSAP ter um número para animar
    const contador = { valor: 0 };

    gsap.to(contador, {
        valor: 100,
        duration: 3.2, // tempo total do carregamento — ajuste à vontade
        ease: 'power1.inOut',
        onUpdate: function () {
            const percentAtual = Math.round(contador.valor);
            elPercent.textContent = percentAtual + '%';
            elBarFill.style.width = percentAtual + '%';
        },
        onComplete: esconderPreloader
    });

    // ---- 3) Ao chegar em 100%, o preloader some e libera o site ----
    function esconderPreloader() {
        gsap.to(preloader, {
            opacity: 0,
            duration: 0.6,
            ease: 'power1.out',
            onComplete: function () {
                preloader.style.display = 'none';
                document.body.classList.remove('preloader-lock');
                // Avisa o restante do site (a Hero, por exemplo) que pode começar
                document.dispatchEvent(new CustomEvent('preloaderComplete'));
            }
        });
    }
})();
