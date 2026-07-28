/* ==========================================================================
   PARTÍCULAS DA HERO — fundo fixo com pontos conectados
   Roda num <canvas> fixo atrás de tudo (ver .hero_particles em hero.css).
   Como o canvas é position:fixed, ele "gruda" na tela enquanto a página
   rola — a Hero não tem fundo próprio, então o canvas aparece por trás
   dela; assim que você rola pra seção seguinte (que tem fundo sólido),
   ela cobre o canvas naturalmente, criando o efeito de fundo fixo.
   Anima o site inteiro (não só a Hero) — só pausa quando a aba fica em
   segundo plano, pra não gastar processamento à toa.
   ========================================================================== */

(function () {
    const canvas = document.getElementById('heroParticles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width, height, particles = [];
    let animando = false;
    let rafId = null;

    const DISTANCIA_MAXIMA = 140; // px — além disso, não desenha linha entre partículas
    const COR_PONTO = '0, 217, 255';  // --color-accent-cta, em "r, g, b"
    const COR_LINHA = '42, 88, 214';  // --color-accent, em "r, g, b"

    function numeroDeParticulas() {
        // Menos partículas em telas pequenas, pra não pesar no celular
        const area = width * height;
        return Math.min(90, Math.round(area / 14000));
    }

    function criarParticulas() {
        const total = numeroDeParticulas();
        particles = Array.from({ length: total }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            r: Math.random() * 1.5 + 0.8
        }));
    }

    function redimensionar() {
        // Usa o tamanho real do canvas na tela (limitado a 1200px de largura
        // pelo CSS), não o viewport inteiro — senão as partículas ficariam
        // espremidas/distorcidas dentro da área realmente visível.
        // Os "|| window.innerWidth/innerHeight" são um seguro: se o CSS
        // devolver 0 (celular com bug de altura de viewport carregando a
        // página, ver comentário do 100dvh em hero.css), o canvas não fica
        // com tamanho zero e as partículas somem sem ninguém entender por quê.
        width = canvas.width = canvas.clientWidth || window.innerWidth;
        height = canvas.height = canvas.clientHeight || window.innerHeight;
        criarParticulas();
    }

    function desenhar() {
        ctx.clearRect(0, 0, width, height);

        // Linhas entre partículas próximas — quanto mais perto, mais visível
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i], b = particles[j];
                const dx = a.x - b.x, dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < DISTANCIA_MAXIMA) {
                    const opacidade = (1 - dist / DISTANCIA_MAXIMA) * 0.35;
                    ctx.strokeStyle = `rgba(${COR_LINHA}, ${opacidade})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        // Pontos
        particles.forEach((p) => {
            ctx.fillStyle = `rgba(${COR_PONTO}, 0.8)`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function atualizar() {
        particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            // Rebate nas bordas da tela, como uma bolinha batendo na parede
            if (p.x <= 0 || p.x >= width) p.vx *= -1;
            if (p.y <= 0 || p.y >= height) p.vy *= -1;
        });
    }

    function loop() {
        atualizar();
        desenhar();
        rafId = requestAnimationFrame(loop);
    }

    function iniciar() {
        if (animando) return;
        animando = true;
        loop();
    }

    function parar() {
        animando = false;
        if (rafId) cancelAnimationFrame(rafId);
    }

    redimensionar();
    window.addEventListener('resize', redimensionar);

    if (prefersReducedMotion) {
        // Quem prefere menos movimento na tela recebe só um quadro parado
        desenhar();
    } else {
        // O fundo agora aparece translúcido em TODAS as seções (não só na
        // Hero — ver background-color em rgba() nas seções em style.css),
        // então a animação precisa continuar rodando o site inteiro, não só
        // enquanto a Hero está visível.
        iniciar();

        // Único cuidado que ainda vale a pena: pausar quando a ABA fica em
        // segundo plano (usuário troca de aba/app) — isso não afeta o que
        // aparece na tela, só evita gastar bateria/processamento à toa com
        // a aba escondida.
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) parar();
            else iniciar();
        });
    }
})();
