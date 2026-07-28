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

    // Só mostra a animação de carregamento uma vez por sessão de
    // navegação (essa aba, até o navegador ser fechado) — quem já viu
    // não fica esperando de novo toda vez que volta pra home ou dá F5.
    // Fechou o navegador e abriu de novo outro dia? Vê a animação de novo.
    let jaMostrouNessaSessao = false;
    try {
        jaMostrouNessaSessao = sessionStorage.getItem('preloaderVisto') === '1';
    } catch (e) {
        // Alguns navegadores bloqueiam sessionStorage (modo privado bem
        // restrito, por exemplo) — nesse caso só mostra o preloader normal.
    }

    if (jaMostrouNessaSessao) {
        preloader.style.display = 'none';
        // setTimeout 0: dá tempo dos outros <script> (como js/hero.js, que
        // carrega DEPOIS deste) rodarem e registrarem o listener do evento
        // 'preloaderComplete' antes da gente disparar ele — se disparasse
        // na hora, sairia "no vácuo" (hero.js ainda nem tinha rodado) e a
        // Hero nunca entrava, ficava invisível pra sempre.
        setTimeout(() => {
            document.dispatchEvent(new CustomEvent('preloaderComplete'));
        }, 0);
        return;
    }

    try {
        sessionStorage.setItem('preloaderVisto', '1');
    } catch (e) {}

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
