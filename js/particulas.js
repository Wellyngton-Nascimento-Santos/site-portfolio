/* ==========================================================================
   PARTÍCULAS DE FUNDO
   Mesma ideia do site atual (pontos que se ligam por linhas quando estão
   perto), agora ocupando a tela inteira e reagindo ao mouse: pontos perto
   do cursor também se ligam a ele.
   A opacidade do canvas é controlada pelo intro3d.js (some no mergulho).
   ========================================================================== */

(function () {
    const canvas = document.getElementById('particulas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const DIST = 130;            // distância máxima pra ligar dois pontos
    const DIST_MOUSE = 170;      // distância máxima pra ligar um ponto ao mouse
    const COR_PONTO = '200, 215, 230';
    const COR_LINHA = '106, 161, 255';
    const COR_MOUSE = '0, 217, 255';

    let largura, altura, dpr, pontos = [];
    const mouse = { x: -9999, y: -9999 };
    let rodando = false;

    function quantidade() {
        // Menos pontos em tela pequena pra não pesar no celular
        return Math.min(110, Math.round((largura * altura) / 15000));
    }

    function redimensionar() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        largura = window.innerWidth;
        altura = window.innerHeight;
        canvas.width = largura * dpr;
        canvas.height = altura * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        pontos = Array.from({ length: quantidade() }, () => ({
            x: Math.random() * largura,
            y: Math.random() * altura,
            vx: (Math.random() - .5) * .28,
            vy: (Math.random() - .5) * .28,
            r: Math.random() * 1.4 + .7
        }));
    }

    function desenhar() {
        ctx.clearRect(0, 0, largura, altura);

        for (let i = 0; i < pontos.length; i++) {
            const a = pontos[i];

            for (let j = i + 1; j < pontos.length; j++) {
                const b = pontos[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const d = Math.hypot(dx, dy);
                if (d < DIST) {
                    ctx.strokeStyle = `rgba(${COR_LINHA}, ${(1 - d / DIST) * .28})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }

            const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
            if (dm < DIST_MOUSE) {
                ctx.strokeStyle = `rgba(${COR_MOUSE}, ${(1 - dm / DIST_MOUSE) * .45})`;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }

            ctx.fillStyle = `rgba(${COR_PONTO}, .75)`;
            ctx.beginPath();
            ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function mover() {
        for (const p of pontos) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > largura) p.vx *= -1;
            if (p.y < 0 || p.y > altura) p.vy *= -1;
        }
    }

    function loop() {
        if (!rodando) return;
        mover();
        desenhar();
        requestAnimationFrame(loop);
    }

    function iniciar() {
        if (rodando || reduz) return;
        rodando = true;
        requestAnimationFrame(loop);
    }

    function parar() {
        rodando = false;
    }

    redimensionar();
    window.addEventListener('resize', redimensionar);
    window.addEventListener('pointermove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('pointerleave', () => {
        mouse.x = mouse.y = -9999;
    });

    if (reduz) {
        desenhar();
    } else {
        iniciar();
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) parar();
        else if (!document.body.classList.contains('is-dentro')) iniciar();
    });

    // O intro3d.js pausa as partículas quando você está dentro do editor
    window.particulas = { iniciar, parar };
})();
