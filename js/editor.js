/* ==========================================================================
   EDITOR (interior do notebook)
   Cada seção do portfólio é um "arquivo". Clicar no arquivo abre uma aba e
   mostra o conteúdo com números de linha e cores de sintaxe.
   O conteúdo de cada arquivo é um array de linhas em HTML; as classes t-*
   (definidas no CSS) fazem o papel do "syntax highlighting".
   ========================================================================== */

(function () {
    // Atalhos pra montar as linhas com cor sem poluir o texto
    const h = (t) => `<span class="t-h">${t}</span>`;   // título
    const k = (t) => `<span class="t-k">${t}</span>`;   // palavra-chave
    const s = (t) => `<span class="t-s">${t}</span>`;   // string
    const c = (t) => `<span class="t-c">${t}</span>`;   // comentário
    const p = (t) => `<span class="t-p">${t}</span>`;   // propriedade
    const n = (t) => `<span class="t-n">${t}</span>`;   // número
    const f = (t) => `<span class="t-f">${t}</span>`;   // função
    const b = (t) => `<span class="t-b">${t}</span>`;   // negrito
    // Ícone SVG do sprite que está no index.html (ex.: icone('js', 'ico ico--js'))
    const icone = (nome, extra = '') => `<svg class="ic${extra ? ' ' + extra : ''}" aria-hidden="true"><use href="#i-${nome}"></use></svg>`;
    const link = (texto, url) => `<a class="t-l" href="${url}" target="_blank" rel="noopener">${texto}</a>`;

    /* ======================================================================
       PROJETOS: pra trocar, adicionar ou remover um projeto, mexa só aqui.
       - imagem: caminho do print (deixe '' se ainda não tiver; aparece um
         quadro "preview em breve" no lugar)
       - link.chave: 'url' pra site no ar, 'repo' pra repositório no GitHub
       ====================================================================== */
    const listaProjetos = [
        {
            nome: 'Letícia Guedes Beauty',
            tipo: 'Sistema de agendamento online',
            stack: ['JavaScript', 'Node.js', 'Express', 'PostgreSQL'],
            status: 'concluído',
            imagem: 'img-projects/leticia-guedes.webp',
            link: { chave: 'url', texto: 'leticiaguedesbeauty.com.br', href: 'https://leticiaguedesbeauty.com.br/' }
        },
        {
            nome: 'NaDel Soluções Digitais',
            tipo: 'Site da empresa de soluções digitais que cofundei',
            papel: 'cofundador · desenvolvimento',
            stack: ['HTML', 'CSS', 'JavaScript'],
            status: 'concluído',
            imagem: 'img-projects/nadel.webp',
            link: { chave: 'url', texto: 'nadel.com.br', href: 'https://nadel.com.br/' }
        },
        {
            nome: 'Arquitetura Onyx',
            tipo: 'Site institucional para escritório de arquitetura',
            stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'GSAP', 'Lenis'],
            status: 'concluído',
            imagem: 'img-projects/onyx.webp',
            link: { chave: 'url', texto: 'ver site', href: 'https://sandbox-arquitetura-luxo-dark.vercel.app/' }
        },
        {
            nome: 'E-commerce DonaDella',
            tipo: 'Loja virtual de piercings com carrinho e checkout',
            stack: ['Node.js', 'Express', 'EJS', 'Sequelize', 'MySQL'],
            status: 'em desenvolvimento',
            imagem: 'img-projects/donadella.webp',
            link: { chave: 'repo', texto: 'github', href: 'https://github.com/somentedois/Donnadela-Commerce' }
        },
        {
            nome: 'Pizzaria CLI',
            tipo: 'Gestão de usuários, pizzas e pedidos pelo terminal',
            stack: ['Node.js', 'Express', 'Sequelize', 'MySQL', 'Inquirer'],
            status: 'em desenvolvimento',
            imagem: 'img-projects/pizzaria-cli.webp',
            link: { chave: 'repo', texto: 'github', href: 'https://github.com/Wellyngton-Nascimento-Santos/pizzaria-cli' }
        }
    ];

    // Print do projeto, mostrado ANTES do objeto com as informações.
    // Fica numa linha só (com um número de linha), como uma pré-visualização
    // de imagem dentro do editor. Clicar abre o site/repositório.
    function blocoPreview(proj) {
        const arquivo = proj.imagem ? proj.imagem.split('/').pop() : 'preview.png';
        const barra = `<span class="prev_barra">${icone('image-reg')}${arquivo}</span>`;
        const area = proj.imagem
            ? `<img src="${proj.imagem}" alt="Tela do projeto ${proj.nome}" width="1120" height="700" loading="lazy" decoding="async">`
            : `<span class="prev_vazio">${icone('image')}preview em breve</span>`;
        return `<a class="prev" href="${proj.link.href}" target="_blank" rel="noopener" aria-label="Abrir ${proj.nome}">${barra}${area}</a>`;
    }

    function montarLinhasProjetos() {
        const linhas = [
            c('// sites e sistemas que desenvolvi'),
            `${k('export const')} projetos = [`
        ];
        listaProjetos.forEach((proj) => {
            linhas.push({ html: blocoPreview(proj), classe: 'l--img' });
            linhas.push('  {');
            linhas.push(`    ${p('nome')}: ${s(`"${proj.nome}"`)},`);
            linhas.push(`    ${p('tipo')}: ${s(`"${proj.tipo}"`)},`);
            // "papel" é opcional: só aparece nos projetos que têm esse campo
            if (proj.papel) linhas.push(`    ${p('papel')}: ${s(`"${proj.papel}"`)},`);
            linhas.push(`    ${p('stack')}: [${proj.stack.map((t) => s(`"${t}"`)).join(', ')}],`);
            linhas.push(`    ${p('status')}: ${s(`"${proj.status}"`)},`);
            linhas.push(`    ${p(proj.link.chave)}: ${link(`"${proj.link.texto}"`, proj.link.href)},`);
            linhas.push('  },');
        });
        linhas.push('];');
        return linhas;
    }

    const arquivos = {
        'sobre.md': {
            icone: ['markdown', 'ico ico--md'],
            linguagem: 'Markdown',
            linhas: [
                h('# Wellyngton Nascimento Santos'),
                '',
                `Estudante de ${b('**Engenharia de Software**')} na Universidade Estácio (conclusão em 2028). Moro em Osasco, SP. Meu primeiro curso de informática foi em 2009, e desde então a tecnologia nunca saiu da minha rotina.`,
                '',
                h('## Hoje'),
                `- Cofundador da ${b('**NaDel Soluções Digitais**')}, onde cuido do desenvolvimento.`,
                '- Crio sites institucionais, landing pages e sistemas web, como agendamento online com área administrativa.',
                '',
                h('## O que procuro'),
                `- ${b('**Estágio ou desenvolvedor júnior**')}.`,
                '',
                h('## Força Aérea Brasileira (2014 a 2022)'),
                '- 8 anos na área administrativa, 5 deles cuidando do cadastro de moradores das vilas militares.',
                '- Quando a FAB implantou um sistema novo, fiz o cadastro inicial de mais de 1.600 moradores e imóveis de São Paulo e Guarulhos, além da fila de espera.',
                '- Fui a ponte entre a seção e a equipe de TI que desenvolveu o sistema: reportava erros e sugeria funções a incluir ou tirar.',
                '- Treinei a seção e o comandante no uso do sistema e cuidava do suporte básico de computadores e impressoras.',
                '',
                h('## Como cheguei aqui'),
                '- 2017: técnico em Informática na Etec, ainda na FAB, pensando em seguir carreira na área de TI.',
                '- Depois da FAB: formação Full Stack na Digital House.',
                '- Agora: graduação em Engenharia de Software, pra ir mais fundo.',
                '',
                c('&lt;!-- abra os outros arquivos no explorador ao lado --&gt;')
            ]
        },

        'projetos.js': {
            icone: ['js', 'ico ico--js'],
            linguagem: 'JavaScript',
            linhas: montarLinhasProjetos()
        },

        'stack.json': {
            icone: ['code', 'ico ico--json'],
            linguagem: 'JSON',
            linhas: [
                c('// o que já usei em projetos e o que estou estudando agora'),
                '{',
                `  ${p('"front"')}: [${s('"HTML"')}, ${s('"CSS"')}, ${s('"JavaScript"')}, ${s('"Design responsivo"')}],`,
                `  ${p('"back"')}: [${s('"Node.js"')}, ${s('"Express"')}, ${s('"APIs REST"')}, ${s('"Sequelize"')}],`,
                `  ${p('"banco"')}: [${s('"PostgreSQL"')}, ${s('"MySQL"')}],`,
                `  ${p('"ferramentas"')}: [${s('"Git"')}, ${s('"GitHub"')}, ${s('"VS Code"')}, ${s('"cPanel"')}, ${s('"Render"')}],`,
                `  ${p('"base"')}: [${s('"Redes"')}, ${s('"Montagem e manutenção de computadores"')}],`,
                `  ${p('"estudando"')}: [${s('"React"')}, ${s('"TypeScript"')}, ${s('"Tailwind CSS"')}],`,
                `  ${p('"idiomas"')}: [${s('"Português"')}, ${s('"Inglês técnico"')}]`,
                '}'
            ]
        },

        'formacao.md': {
            icone: ['markdown', 'ico ico--md'],
            linguagem: 'Markdown',
            linhas: [
                h('# Formação'),
                '',
                h('## Graduação'),
                `- ${b('Engenharia de Software')}, Universidade Estácio. Cursando, conclusão prevista para 2028.`,
                '',
                h('## Técnico'),
                `- ${b('Técnico de Informática')}, Etec Albert Einstein. Concluído em 2017: redes, banco de dados, programação, montagem e manutenção de computadores.`,
                '',
                h('## Qualificação'),
                `- ${b('Desenvolvedor Web Full Stack')}, Digital House (227 horas): HTML, CSS, JavaScript, React, Node.js, Express, banco de dados e APIs.`,
                '',
                h('## Cursos complementares'),
                '- Computação em Nuvem AWS, Ka Solution / AWS',
                '- Raciocínio Lógico e Resolução de Problemas, Universidade Estácio',
                '- HTML Avançado, Fundação Bradesco',
                '- Montagem e Manutenção de Micros, Microlins',
                '- Informática, Eurodata (2009), meu primeiro curso na área'
            ]
        },

        'contato.sh': {
            icone: ['terminal', 'ico ico--sh'],
            linguagem: 'Shell Script',
            linhas: [
                c('#!/usr/bin/env bash'),
                c('# vamos conversar?'),
                '',
                `${p('EMAIL')}=${link('"wellyngton.nsantos1910@gmail.com"', 'mailto:wellyngton.nsantos1910@gmail.com')}`,
                `${p('LINKEDIN')}=${link('"linkedin.com/in/wellyngton-nascimento-santos"', 'https://www.linkedin.com/in/wellyngton-nascimento-santos-44944322b/')}`,
                `${p('GITHUB')}=${link('"github.com/Wellyngton-Nascimento-Santos"', 'https://github.com/Wellyngton-Nascimento-Santos')}`,
                `${p('WHATSAPP')}=${link('"+55 11 94000-8552"', 'https://wa.me/5511940008552')}`,
                '',
                `${f('echo')} ${s('"Aberto a oportunidades de estágio ou desenvolvedor júnior."')}`
            ]
        }
    };

    const ordem = Object.keys(arquivos);
    const abertas = ['sobre.md'];
    let atual = 'sobre.md';

    const arvore = document.getElementById('arvore');
    const abas = document.getElementById('abas');
    const codigo = document.getElementById('codigo');
    const statusLinguagem = document.getElementById('statusLinguagem');

    function montarArvore() {
        // ".." é o "subir uma pasta" de qualquer explorador de arquivos:
        // aqui ele volta pro início (hero). Quem clica é o intro3d.js (classe js-voltar).
        const subir = `
            <li><button type="button" class="ed_subir js-voltar" title="Voltar ao início">
                ${icone('arrow-turn-up')}.. <span class="ed_subir_txt">voltar ao início</span>
            </button></li>`;
        // Setas das pontas: só aparecem no celular, quando a faixa de arquivos
        // tem mais conteúdo escondido pra aquele lado (ver atualizarSetas)
        const seta = (lado, direcao) => `
            <li class="ed_seta ed_seta--${lado}" aria-hidden="true"><button type="button" tabindex="-1" data-rolar="${direcao}">${icone('chevron-down')}</button></li>`;
        arvore.innerHTML = seta('esq', -1) + subir + ordem.map((nome) => `
            <li><button type="button" data-arquivo="${nome}" aria-current="${nome === atual}">
                ${icone(...arquivos[nome].icone)}${nome}
            </button></li>`).join('') + seta('dir', 1);
    }

    /* ---------- Faixa de arquivos no celular: mostrar que dá pra arrastar ---------- */

    const explorer = document.querySelector('.ed_explorer');
    const celular = window.matchMedia('(max-width: 760px)');
    const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Liga a seta (e o degradê) de cada lado só quando tem arquivo escondido ali
    function atualizarSetas() {
        const sobraDir = explorer.scrollWidth - explorer.clientWidth - explorer.scrollLeft;
        explorer.classList.toggle('pode-esq', explorer.scrollLeft > 4);
        explorer.classList.toggle('pode-dir', sobraDir > 4);
    }

    // Mantém o arquivo aberto visível, no meio da faixa
    function centralizarAtivo(suave = true) {
        if (!celular.matches) return;
        const ativo = arvore.querySelector('button[aria-current="true"]');
        if (!ativo) return;
        const alvo = ativo.offsetLeft - (explorer.clientWidth - ativo.offsetWidth) / 2;
        explorer.scrollTo({ left: Math.max(0, alvo), behavior: suave && !reduzMovimento ? 'smooth' : 'auto' });
    }

    // Na primeira vez que o editor abre no celular, a faixa dá uma "espiadinha"
    // pro lado e volta: mostra, sem precisar de texto, que ela rola
    let jaDeuDica = false;
    function dicaDeArrastar() {
        if (jaDeuDica || !celular.matches || reduzMovimento) return;
        if (explorer.scrollWidth <= explorer.clientWidth + 4) return;
        jaDeuDica = true;
        setTimeout(() => {
            explorer.scrollTo({ left: 80, behavior: 'smooth' });
            setTimeout(() => explorer.scrollTo({ left: 0, behavior: 'smooth' }), 900);
        }, 900);
    }

    explorer.addEventListener('scroll', atualizarSetas, { passive: true });
    window.addEventListener('resize', atualizarSetas);

    function montarAbas() {
        abas.innerHTML = abertas.map((nome) => `
            <button type="button" class="ed_aba" role="tab" data-arquivo="${nome}" aria-selected="${nome === atual}">
                ${icone(...arquivos[nome].icone)}${nome}
            </button>`).join('');
    }

    function montarCodigo(animar) {
        const arq = arquivos[atual];
        codigo.innerHTML = arq.linhas
            .map((linha, i) => {
                // Linha comum é texto; linha especial (como o print do projeto)
                // vem como objeto { html, classe }
                const html = typeof linha === 'object' ? linha.html : linha;
                const extra = typeof linha === 'object' ? ` ${linha.classe}` : '';
                return `<span class="l${extra}${animar ? ' entra' : ''}" style="animation-delay:${Math.min(i * 28, 600)}ms">${html || ' '}</span>`;
            })
            .join('');
        codigo.scrollTop = 0;
        statusLinguagem.textContent = arq.linguagem;
    }

    function abrir(nome, animar = true) {
        if (!arquivos[nome]) return;
        atual = nome;
        if (!abertas.includes(nome)) abertas.push(nome);
        montarArvore();
        montarAbas();
        montarCodigo(animar);
        requestAnimationFrame(() => {
            centralizarAtivo();
            atualizarSetas();
        });
    }

    document.addEventListener('click', (e) => {
        const alvo = e.target.closest('[data-arquivo]');
        if (alvo) abrir(alvo.dataset.arquivo);
        const rolar = e.target.closest('[data-rolar]');
        if (rolar) explorer.scrollBy({ left: Number(rolar.dataset.rolar) * explorer.clientWidth * .6, behavior: 'smooth' });
    });

    abrir('sobre.md', false);

    // O intro3d.js chama isso quando a câmera termina de entrar na tela
    window.editorPortfolio = {
        animarEntrada() {
            montarCodigo(true);
            codigo.focus({ preventScroll: true });
            requestAnimationFrame(() => {
                atualizarSetas();
                dicaDeArrastar();
            });
        }
    };
})();
