/* ==========================================================================
   INTRO 3D: o notebook que abre no scroll
   ----------------------------------------------------------------------
   Roteiro, controlado pela rolagem (p vai de 0 a 1):
     0.00 a 0.24  o hero sai e o notebook fechado sobe girando
     0.22 a 0.50  a tampa abre e a câmera desce pra altura dos olhos
     0.47 a 0.53  a tela liga (com uma piscada)
     0.53 a 0.73  terminal digitando "npm run portfolio"
     0.73 a 0.79  a tela troca pro editor (prévia do que vem a seguir)
     0.76 a 0.99  a câmera mergulha até a tela ocupar a tela do navegador
     0.99         troca pra versão HTML real do editor (entrar())
   O notebook é montado com formas do próprio Three.js (caixas com borda
   arredondada), sem arquivo de modelo 3D pra baixar: fica leve e dá pra
   explicar cada peça numa entrevista.
   ========================================================================== */

(function () {
// Script comum (não "module") de propósito: assim funciona até abrindo o
// HTML com dois cliques. O Three.js é carregado lá embaixo com import().
const { gsap, ScrollTrigger } = window;
gsap.registerPlugin(ScrollTrigger);

const html = document.documentElement;
const body = document.body;
const editor = document.getElementById('editor');
const hero = document.querySelector('.hero');
const dica = document.querySelector('.dica_scroll');
const topo = document.querySelector('.topo');
const canvasParticulas = document.getElementById('particulas');
const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Sempre começa pelo hero, mesmo se a pessoa der F5 no meio da animação
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

/* ---------------- Funções de apoio ---------------- */

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const lerp = (a, b, t) => a + (b - a) * t;
// Converte p numa sub-faixa: antes de "ini" = 0, depois de "fim" = 1
const faixa = (p, ini, fim) => clamp((p - ini) / (fim - ini));
const suave = (t) => t * t * (3 - 2 * t);
const entraESai = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const desacelera = (t) => 1 - Math.pow(1 - t, 3);

/* ---------------- Scroll suave (Lenis) ---------------- */

let lenis = null;

function ligarLenis() {
    if (reduz || lenis) return;
    lenis = new window.Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on('scroll', ScrollTrigger.update);
}

function desligarLenis() {
    if (!lenis) return;
    lenis.destroy();
    lenis = null;
}

// Um relógio só pra tudo: o GSAP chama o Lenis a cada quadro
gsap.ticker.add((tempo) => lenis && lenis.raf(tempo * 1000));
gsap.ticker.lagSmoothing(0);

/* ---------------- Entrar e sair do notebook ---------------- */

let dentro = false;
let emTransicao = false;
let cena = null;

function entrar() {
    if (dentro || emTransicao) return;
    dentro = true;
    emTransicao = true;

    editor.hidden = false;
    window.editorPortfolio && window.editorPortfolio.animarEntrada();

    gsap.fromTo(editor, { autoAlpha: 0, scale: 1.015 }, {
        autoAlpha: 1,
        scale: 1,
        duration: .6,
        ease: 'power2.out',
        onComplete() {
            html.classList.add('is-dentro');
            body.classList.add('is-dentro');
            body.classList.remove('is-intro');
            desligarLenis();
            cena && cena.pausar();
            window.particulas && window.particulas.parar();
            emTransicao = false;
        }
    });
}

function sair() {
    if (!dentro || emTransicao) return;
    emTransicao = true;

    html.classList.remove('is-dentro');
    body.classList.remove('is-dentro');
    body.classList.add('is-intro');
    window.scrollTo(0, 0);
    topo.style.opacity = 1;

    if (cena) {
        cena.resetar();
        ligarLenis();
        cena.retomar();
    }
    window.particulas && window.particulas.iniciar();

    gsap.to(editor, {
        autoAlpha: 0,
        duration: .45,
        ease: 'power2.in',
        onComplete() {
            editor.hidden = true;
            dentro = false;
            emTransicao = false;
        }
    });
}

document.getElementById('pularIntro').addEventListener('click', entrar);
document.getElementById('entrarDireto').addEventListener('click', entrar);
document.getElementById('sairNotebook').addEventListener('click', sair);

/* ==========================================================================
   A CENA
   ========================================================================== */

function criarCena(THREE, RoundedBoxGeometry, RoomEnvironment) {
    const canvas = document.getElementById('cena3d');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();

    // Ambiente de "estúdio" gerado na hora: dá os reflexos do alumínio
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), .04).texture;

    const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, .05, 200);

    /* ---------- Luzes ---------- */
    scene.add(new THREE.HemisphereLight(0xbfd8ff, 0x0b0f15, .5));

    const luzPrincipal = new THREE.DirectionalLight(0xffffff, 1.3);
    luzPrincipal.position.set(4, 6, 5);
    scene.add(luzPrincipal);

    // Luz de contorno ciano por trás: puxa a cor da identidade pro alumínio
    const luzContorno = new THREE.DirectionalLight(0x00d9ff, 2.4);
    luzContorno.position.set(-5, 3, -6);
    scene.add(luzContorno);

    /* ---------- Medidas do notebook (em "unidades" da cena) ---------- */
    const LARG = 3.2;        // largura
    const PROF = 2.2;        // profundidade da base
    const ALT_BASE = .11;    // espessura da base
    const ALT_TAMPA = 2.1;   // altura da tampa
    const ESP_TAMPA = .065;  // espessura da tampa
    const TELA_W = 2.96;
    const TELA_H = 1.85;     // proporção 16:10
    const ANG_FECHADA = Math.PI / 2;
    const ANG_ABERTA = -.3;  // ~17 graus pra trás da vertical

    /* ---------- Materiais ---------- */
    const aluminio = new THREE.MeshStandardMaterial({ color: 0x2b2f36, metalness: .9, roughness: .32, envMapIntensity: .9 });
    const aluminioEscuro = new THREE.MeshStandardMaterial({ color: 0x1a1d22, metalness: .8, roughness: .4 });
    const teclaMat = new THREE.MeshStandardMaterial({ color: 0x0a0c0f, metalness: .1, roughness: .8, envMapIntensity: .35 });
    const vidroPreto = new THREE.MeshStandardMaterial({ color: 0x020304, metalness: 0, roughness: .35, envMapIntensity: .25 });
    const touchpadMat = new THREE.MeshStandardMaterial({ color: 0x353a42, metalness: .6, roughness: .25 });

    const notebook = new THREE.Group();
    scene.add(notebook);

    /* ---------- Base ---------- */
    const base = new THREE.Mesh(new RoundedBoxGeometry(LARG, ALT_BASE, PROF, 4, .045), aluminio);
    base.position.y = ALT_BASE / 2;
    notebook.add(base);

    const rebaixo = new THREE.Mesh(new THREE.BoxGeometry(2.86, .002, 1.08), aluminioEscuro);
    rebaixo.position.set(0, ALT_BASE + .001, -.46);
    notebook.add(rebaixo);

    // Teclado: uma única malha "instanciada" desenha todas as teclas de uma vez
    const PASSO = .19;
    const fileiras = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5],
        [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.75],
        [2.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.25],
        [1, 1, 1.25, 1.25, 5.5, 1.25, 1.25, 1, 1, 1]
    ];
    const totalTeclas = fileiras.reduce((s, f) => s + f.length, 0);
    const TECLA = .155;
    const teclas = new THREE.InstancedMesh(new RoundedBoxGeometry(TECLA, .022, TECLA, 2, .008), teclaMat, totalTeclas);
    const molde = new THREE.Object3D();
    let indice = 0;
    fileiras.forEach((fileira, f) => {
        const larguraFileira = fileira.reduce((s, u) => s + u, 0) * PASSO;
        let x = -larguraFileira / 2;
        fileira.forEach((unidades) => {
            const w = unidades * PASSO;
            molde.position.set(x + w / 2, ALT_BASE + .011, -.84 + f * PASSO);
            molde.scale.set((w - .035) / TECLA, 1, 1);
            molde.updateMatrix();
            teclas.setMatrixAt(indice++, molde.matrix);
            x += w;
        });
    });
    notebook.add(teclas);

    const touchpad = new THREE.Mesh(new RoundedBoxGeometry(1.15, .006, .7, 2, .003), touchpadMat);
    touchpad.position.set(0, ALT_BASE, .56);
    notebook.add(touchpad);

    /* ---------- Tampa (gira em torno da dobradiça) ---------- */
    const dobradica = new THREE.Group();
    dobradica.position.set(0, ALT_BASE + .03, -PROF / 2 + .05);
    notebook.add(dobradica);

    const eixo = new THREE.Mesh(new THREE.CylinderGeometry(.035, .035, 2.4, 20), aluminioEscuro);
    eixo.rotation.z = Math.PI / 2;
    dobradica.add(eixo);

    const tampa = new THREE.Mesh(new RoundedBoxGeometry(LARG, ALT_TAMPA, ESP_TAMPA, 4, .03), aluminio);
    tampa.position.set(0, ALT_TAMPA / 2, -ESP_TAMPA / 2);
    dobradica.add(tampa);

    const moldura = new THREE.Mesh(new THREE.PlaneGeometry(LARG - .06, ALT_TAMPA - .06), vidroPreto);
    moldura.position.set(0, ALT_TAMPA / 2, .0015);
    dobradica.add(moldura);

    /* ---------- A tela: um canvas 2D vira textura ---------- */
    const telaCanvas = document.createElement('canvas');
    telaCanvas.width = 1280;
    telaCanvas.height = 800;
    const tctx = telaCanvas.getContext('2d');
    const telaTex = new THREE.CanvasTexture(telaCanvas);
    telaTex.colorSpace = THREE.SRGBColorSpace;
    telaTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const telaMat = new THREE.MeshBasicMaterial({ map: telaTex, toneMapped: false });
    telaMat.color.setScalar(0);
    const tela = new THREE.Mesh(new THREE.PlaneGeometry(TELA_W, TELA_H), telaMat);
    tela.position.set(0, ALT_TAMPA / 2 + .06, .003);
    dobradica.add(tela);

    // Luz que "sai" da tela e ilumina o teclado quando ela liga
    const luzTela = new THREE.PointLight(0x9fe8ff, 0, 5, 2);
    luzTela.position.set(0, 1, .9);
    dobradica.add(luzTela);

    /* ---------- Logo na parte de trás da tampa ---------- */
    const logoCanvas = document.createElement('canvas');
    logoCanvas.width = logoCanvas.height = 256;
    const lctx = logoCanvas.getContext('2d');
    lctx.strokeStyle = 'rgba(0, 217, 255, .9)';
    lctx.lineWidth = 6;
    lctx.beginPath();
    lctx.arc(128, 128, 110, 0, Math.PI * 2);
    lctx.stroke();
    lctx.fillStyle = '#00d9ff';
    lctx.font = '700 140px Inter, system-ui, sans-serif';
    lctx.textAlign = 'center';
    lctx.textBaseline = 'middle';
    lctx.fillText('W', 128, 136);
    const logoTex = new THREE.CanvasTexture(logoCanvas);
    logoTex.colorSpace = THREE.SRGBColorSpace;
    const logo = new THREE.Mesh(
        new THREE.PlaneGeometry(.42, .42),
        new THREE.MeshBasicMaterial({ map: logoTex, transparent: true, toneMapped: false, opacity: .85 })
    );
    logo.position.set(0, ALT_TAMPA / 2, -ESP_TAMPA - .002);
    // Virado 180 graus: o notebook só é visto fechado, de frente, então o
    // "W" precisa ficar de pé pra quem olha nesse ângulo (senão vira "M")
    logo.rotation.set(0, Math.PI, Math.PI);
    dobradica.add(logo);

    /* ---------- Sombra falsa no "chão" (gradiente, bem mais leve que sombra real) ---------- */
    const sombraCanvas = document.createElement('canvas');
    sombraCanvas.width = sombraCanvas.height = 256;
    const sctx = sombraCanvas.getContext('2d');
    const grad = sctx.createRadialGradient(128, 128, 10, 128, 128, 128);
    grad.addColorStop(0, 'rgba(0, 0, 0, .7)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 256, 256);
    const sombraMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sombraCanvas), transparent: true, depthWrite: false });
    const sombra = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 3.6), sombraMat);
    sombra.rotation.x = -Math.PI / 2;
    sombra.position.y = -.002;
    notebook.add(sombra);

    /* ======================================================================
       O que aparece na tela (desenhado num canvas 2D)
       ====================================================================== */

    const MONO = '"JetBrains Mono", ui-monospace, Menlo, Consolas, monospace';
    const COMANDO = 'npm run portfolio';
    const SAIDAS = [
        { texto: '> carregando projetos ........... ', ok: true },
        { texto: '> compilando experiência ........ ', ok: true },
        { texto: '> abrindo editor ................ ', ok: true },
        { texto: '', ok: false },
        { texto: 'pronto. bem-vindo ao meu portfólio.', ok: false, destaque: true }
    ];

    function desenharTerminal(caracteres, saidasVisiveis, cursorAceso) {
        const W = telaCanvas.width;
        const H = telaCanvas.height;
        tctx.fillStyle = '#0a0e13';
        tctx.fillRect(0, 0, W, H);

        // Barra da janela do terminal
        tctx.fillStyle = '#080b10';
        tctx.fillRect(0, 0, W, 56);
        ['#ff5f57', '#febc2e', '#28c840'].forEach((cor, i) => {
            tctx.fillStyle = cor;
            tctx.beginPath();
            tctx.arc(32 + i * 26, 28, 8, 0, Math.PI * 2);
            tctx.fill();
        });
        tctx.fillStyle = '#7d8b9c';
        tctx.font = `500 22px ${MONO}`;
        tctx.textAlign = 'center';
        tctx.fillText('wellyngton@dev: ~', W / 2, 36);

        tctx.textAlign = 'left';
        tctx.font = `500 30px ${MONO}`;
        let x = 48;
        let y = 130;
        const escrever = (texto, cor) => {
            tctx.fillStyle = cor;
            tctx.fillText(texto, x, y);
            x += tctx.measureText(texto).width;
        };

        escrever('wellyngton@dev', '#00d9ff');
        escrever(':', '#c9d4e0');
        escrever('~', '#6aa1ff');
        escrever('$ ', '#c9d4e0');
        escrever(COMANDO.slice(0, caracteres), '#e6edf3');

        let cursorX = x;
        let cursorY = y;

        for (let i = 0; i < saidasVisiveis; i++) {
            const saida = SAIDAS[i];
            x = 48;
            y += 56;
            if (saida.destaque) {
                tctx.font = `700 30px ${MONO}`;
                escrever(saida.texto, '#e6edf3');
                tctx.font = `500 30px ${MONO}`;
            } else {
                escrever(saida.texto, '#8b98a9');
                if (saida.ok) escrever('ok', '#3ddc97');
            }
            cursorX = x;
            cursorY = y;
        }

        // Depois da última saída o cursor vai pra uma linha nova com prompt
        if (saidasVisiveis === SAIDAS.length) {
            x = 48;
            y += 56;
            escrever('$ ', '#c9d4e0');
            cursorX = x;
            cursorY = y;
        }

        if (cursorAceso) {
            tctx.fillStyle = '#00d9ff';
            tctx.fillRect(cursorX + 4, cursorY - 26, 16, 32);
        }
    }

    // Prévia do editor desenhada igual à versão HTML, pra troca final ser invisível
    const PREVIA = [
        ['h', '# Wellyngton Nascimento Santos'],
        ['', ''],
        ['', 'Estudante de **Engenharia de Software** na Universidade Estácio,'],
        ['', 'com conclusão prevista para 2028. Moro em Osasco, SP.'],
        ['', ''],
        ['h', '## Hoje'],
        ['', '- Desenvolvo sites e sistemas para clientes reais.'],
        ['', '- Tenho um sistema de agendamento online em produção, com'],
        ['', '  front-end, API em Node.js e banco PostgreSQL.'],
        ['', ''],
        ['h', '## Antes do código'],
        ['', '- 8 anos na Força Aérea Brasileira (2014 a 2022).'],
        ['', '- Coordenei a equipe de atendimento médico ao público.'],
        ['', '- Participei da implantação de um novo sistema de cadastro'],
        ['', '  de moradores.'],
        ['', ''],
        ['h', '## O que procuro']
    ];
    const ARQUIVOS = ['sobre.md', 'projetos.js', 'stack.json', 'formacao.md', 'contato.sh'];

    function desenharEditor() {
        const W = telaCanvas.width;
        const H = telaCanvas.height;
        tctx.fillStyle = '#0b0f15';
        tctx.fillRect(0, 0, W, H);

        // Barra de título
        tctx.fillStyle = '#080b10';
        tctx.fillRect(0, 0, W, 44);
        ['#ff5f57', '#febc2e', '#28c840'].forEach((cor, i) => {
            tctx.fillStyle = cor;
            tctx.beginPath();
            tctx.arc(26 + i * 22, 22, 7, 0, Math.PI * 2);
            tctx.fill();
        });
        tctx.font = `500 17px ${MONO}`;
        tctx.fillStyle = '#7d8b9c';
        tctx.textAlign = 'center';
        tctx.fillText('wellyngton.dev · portfolio', W / 2, 28);
        tctx.textAlign = 'right';
        tctx.fillStyle = '#00d9ff';
        tctx.fillText('Baixar CV', W - 24, 28);
        tctx.textAlign = 'left';

        // Barra de atividades e explorador
        tctx.fillStyle = '#080b10';
        tctx.fillRect(0, 44, 56, H - 44 - 30);
        tctx.fillStyle = '#0f141b';
        tctx.fillRect(56, 44, 270, H - 44 - 30);
        tctx.fillStyle = '#4a586b';
        [80, 124, 168, 212].forEach((yy) => tctx.fillRect(18, yy, 20, 20));

        tctx.font = `500 13px ${MONO}`;
        tctx.fillStyle = '#7d8b9c';
        tctx.fillText('EXPLORADOR', 76, 82);
        tctx.font = `700 16px ${MONO}`;
        tctx.fillStyle = '#c9d4e0';
        tctx.fillText('v portfolio', 76, 118);
        tctx.font = `500 16px ${MONO}`;
        ARQUIVOS.forEach((nome, i) => {
            const yy = 152 + i * 32;
            if (i === 0) {
                tctx.fillStyle = 'rgba(0, 217, 255, .1)';
                tctx.fillRect(56, yy - 21, 270, 30);
                tctx.fillStyle = '#00d9ff';
                tctx.fillRect(56, yy - 21, 3, 30);
            }
            tctx.fillStyle = i === 0 ? '#e6edf3' : '#8b98a9';
            tctx.fillText(nome, 104, yy);
        });

        // Abas
        tctx.fillStyle = '#080b10';
        tctx.fillRect(326, 44, W - 326, 42);
        tctx.fillStyle = '#0b0f15';
        tctx.fillRect(326, 44, 150, 42);
        tctx.fillStyle = '#00d9ff';
        tctx.fillRect(326, 44, 150, 2);
        tctx.fillStyle = '#e6edf3';
        tctx.fillText('sobre.md', 352, 71);

        // Código com números de linha
        tctx.font = `500 17px ${MONO}`;
        PREVIA.forEach(([tipo, texto], i) => {
            const yy = 124 + i * 30;
            tctx.fillStyle = '#4a586b';
            tctx.textAlign = 'right';
            tctx.fillText(String(i + 1), 380, yy);
            tctx.textAlign = 'left';
            tctx.fillStyle = tipo === 'h' ? '#00d9ff' : '#c9d4e0';
            tctx.font = tipo === 'h' ? `700 17px ${MONO}` : `500 17px ${MONO}`;
            tctx.fillText(texto, 404, yy);
            tctx.font = `500 17px ${MONO}`;
        });

        // Barra de status
        tctx.fillStyle = '#062a35';
        tctx.fillRect(0, H - 30, W, 30);
        tctx.font = `500 14px ${MONO}`;
        tctx.fillStyle = '#bfeffa';
        tctx.fillText('main', 20, H - 10);
        tctx.fillStyle = '#3ddc97';
        tctx.fillText('● disponível para estágio', 90, H - 10);
    }

    // Só redesenha a textura quando algo mudou (economiza GPU)
    let assinaturaAnterior = '';
    function atualizarTela(caracteres, saidas, cursor, mistura) {
        const misturaQ = Math.round(mistura * 30) / 30;
        const assinatura = `${caracteres}|${saidas}|${cursor}|${misturaQ}`;
        if (assinatura === assinaturaAnterior) return;
        assinaturaAnterior = assinatura;

        if (misturaQ < 1) desenharTerminal(caracteres, saidas, cursor);
        if (misturaQ > 0) {
            tctx.save();
            tctx.globalAlpha = misturaQ;
            desenharEditor();
            tctx.restore();
        }
        telaTex.needsUpdate = true;
    }

    // Redesenha quando a fonte JetBrains Mono terminar de carregar
    if (document.fonts) {
        document.fonts.load(`500 30px "JetBrains Mono"`).then(() => { assinaturaAnterior = ''; });
    }

    /* ======================================================================
       Câmera: enquadramentos calculados a partir do tamanho da janela,
       assim funciona igual no desktop e no celular em pé
       ====================================================================== */

    const metadeFov = () => Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);

    // Distância pra um objeto de largura w e altura h ocupar "ocupa" da tela
    function distanciaPraCaber(w, h, ocupa) {
        const t = metadeFov();
        return Math.max((h / 2) / (t * ocupa), (w / 2) / (t * camera.aspect * ocupa));
    }

    function posicaoOrbita(alvo, elevacao, distancia) {
        return new THREE.Vector3(
            alvo.x,
            alvo.y + Math.sin(elevacao) * distancia,
            alvo.z + Math.cos(elevacao) * distancia
        );
    }

    const alvoA = new THREE.Vector3(0, .25, .05);   // notebook fechado, visto de cima
    const alvoB = new THREE.Vector3(0, .85, -.45);  // aberto, na altura dos olhos
    const centroTela = new THREE.Vector3();
    const normalTela = new THREE.Vector3();
    const quatTela = new THREE.Quaternion();
    const camPos = new THREE.Vector3();
    const camAlvo = new THREE.Vector3();

    /* ======================================================================
       Scroll -> progresso p (suavizado pelo scrub do ScrollTrigger)
       ====================================================================== */

    const estado = { p: 0 };
    const animacao = gsap.to(estado, {
        p: 1,
        ease: 'none',
        scrollTrigger: {
            trigger: '#intro',
            start: 'top top',
            end: 'bottom bottom',
            scrub: .9
        }
    });

    function quadro(tempo) {
        const p = estado.p;

        /* 1. Notebook sobe girando, vindo de baixo da tela */
        // No celular em pé o notebook pode "vazar" um pouco das bordas: fica mais imersivo
        const retrato = camera.aspect < 1;
        const distA = distanciaPraCaber(3.6, 2.6, retrato ? 1 : .78);
        // Começa bem abaixo da borda da tela, pra não aparecer atrás do hero
        const yInicial = alvoA.y - distA * metadeFov() * 1.7 - 1.6;
        const sobe = suave(faixa(p, 0, .24));
        notebook.position.y = lerp(yInicial, 0, sobe);
        notebook.visible = p > .004; // parado no hero: nada de notebook aparecendo atrás
        notebook.rotation.y = lerp(-.75, 0, desacelera(faixa(p, 0, .3)));
        notebook.rotation.x = lerp(.25, 0, sobe);

        /* 2. Tampa abre */
        dobradica.rotation.x = lerp(ANG_FECHADA, ANG_ABERTA, entraESai(faixa(p, .22, .5)));

        /* 3. Tela liga (com piscada) */
        const liga = faixa(p, .47, .53);
        const brilho = liga < 1 ? liga * (.7 + .3 * Math.sin(liga * 48)) : 1;
        telaMat.color.setScalar(brilho);
        luzTela.intensity = brilho * 2.2;
        logo.material.opacity = .85 * (1 - faixa(p, .3, .45));

        /* 4. Terminal digitando, depois prévia do editor */
        const digita = faixa(p, .53, .73);
        const caracteres = Math.round(clamp(digita / .4) * COMANDO.length);
        const saidas = Math.floor(clamp((digita - .45) / .5) * SAIDAS.length);
        const cursor = Math.floor(tempo * 2.2) % 2 === 0;
        const mistura = suave(faixa(p, .73, .79));
        atualizarTela(caracteres, saidas, cursor, mistura);

        /* 5. Câmera: de cima -> altura dos olhos -> mergulho na tela */
        const posA = posicaoOrbita(alvoA, .62, distA);
        const distB = distanciaPraCaber(3.5, 2.5, retrato ? 1.12 : .86) * lerp(1, .93, faixa(p, .5, .76));
        const posB = posicaoOrbita(alvoB, .16, distB);
        const ab = entraESai(faixa(p, .18, .52));
        camPos.lerpVectors(posA, posB, ab);
        camAlvo.lerpVectors(alvoA, alvoB, ab);

        const mergulho = entraESai(faixa(p, .76, .99));
        if (mergulho > 0) {
            notebook.updateMatrixWorld(true);
            tela.getWorldPosition(centroTela);
            tela.getWorldQuaternion(quatTela);
            normalTela.set(0, 0, 1).applyQuaternion(quatTela);
            // Distância em que a tela "cobre" a janela inteira
            const t = metadeFov();
            const distC = Math.min((TELA_H / 2) / t, (TELA_W / 2) / (t * camera.aspect)) * .97;
            const posC = centroTela.clone().addScaledVector(normalTela, distC);
            camPos.lerp(posC, mergulho);
            camAlvo.lerp(centroTela, mergulho);
        }

        camera.position.copy(camPos);
        camera.lookAt(camAlvo);

        /* 6. O que fica em volta: hero, dica, partículas, sombra */
        const saiHero = faixa(p, 0, .12);
        hero.style.opacity = 1 - saiHero;
        hero.style.transform = `translateY(${-saiHero * 40}px)`;
        dica.style.opacity = 1 - faixa(p, 0, .04);
        topo.style.opacity = 1 - faixa(p, .76, .84);
        canvasParticulas.style.opacity = 1 - suave(faixa(p, .8, .97));
        sombraMat.opacity = sobe * (1 - mergulho);

        renderer.render(scene, camera);

        if (p > .993 && !dentro) entrar();
    }

    let rodando = false;
    function retomar() {
        if (rodando) return;
        rodando = true;
        gsap.ticker.add(quadro);
    }
    function pausar() {
        rodando = false;
        gsap.ticker.remove(quadro);
    }

    // Volta tudo pro começo na hora (sem animar a volta) ao sair do editor
    function resetar() {
        const st = animacao.scrollTrigger;
        st.update();
        const suavizacao = st.getTween();
        if (suavizacao) suavizacao.progress(1);
        animacao.progress(0);
        estado.p = 0;
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight, false);
    });

    retomar();
    return { pausar, retomar, resetar };
}

/* ---------------- Inicialização ---------------- */

(async () => {
    if (reduz) {
        body.classList.add('sem-3d');
        return;
    }
    try {
        const THREE = await import('three');
        const { RoundedBoxGeometry } = await import('three/addons/geometries/RoundedBoxGeometry.js');
        const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');
        cena = criarCena(THREE, RoundedBoxGeometry, RoomEnvironment);
        ligarLenis();
    } catch (erro) {
        // Sem WebGL ou sem internet pra baixar o Three.js: versão simples com botão
        console.warn('Usando versão simples da abertura:', erro);
        body.classList.add('sem-3d');
    }
})();
})();
