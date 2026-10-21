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
    const link = (texto, url) => `<a class="t-l" href="${url}" target="_blank" rel="noopener">${texto}</a>`;

    const arquivos = {
        'sobre.md': {
            icone: 'fa-brands fa-markdown ico ico--md',
            linguagem: 'Markdown',
            linhas: [
                h('# Wellyngton Nascimento Santos'),
                '',
                `Estudante de ${b('**Engenharia de Software**')} na Universidade Estácio,`,
                'com conclusão prevista para 2028. Moro em Osasco, SP.',
                '',
                h('## Hoje'),
                '- Desenvolvo sites e sistemas para clientes reais.',
                '- Tenho um sistema de agendamento online em produção, com',
                '  front-end, API em Node.js e banco PostgreSQL.',
                '',
                h('## Antes do código'),
                '- 8 anos na Força Aérea Brasileira (2014 a 2022).',
                '- Coordenei a equipe de atendimento médico ao público.',
                '- Participei da implantação de um novo sistema de cadastro',
                '  de moradores.',
                '',
                h('## O que procuro'),
                `- ${b('Estágio')} em desenvolvimento web ou de sistemas.`,
                '',
                c('&lt;!-- abra os outros arquivos no explorador ao lado --&gt;')
            ]
        },

        'projetos.js': {
            icone: 'fa-brands fa-js ico ico--js',
            linguagem: 'JavaScript',
            linhas: [
                c('// projetos com cliente real e projetos de estudo'),
                `${k('export const')} projetos = [`,
                '  {',
                `    ${p('nome')}: ${s('"Letícia Guedes Beauty"')},`,
                `    ${p('tipo')}: ${s('"Sistema de agendamento online"')},`,
                `    ${p('stack')}: [${s('"JavaScript"')}, ${s('"Node.js"')}, ${s('"Express"')}, ${s('"PostgreSQL"')}],`,
                `    ${p('status')}: ${s('"em produção · cliente real"')},`,
                `    ${p('url')}: ${link('"leticiaguedesbeauty.com.br"', 'https://leticiaguedesbeauty.com.br/')},`,
                '  },',
                '  {',
                `    ${p('nome')}: ${s('"Pinturas Profissionais"')},`,
                `    ${p('tipo')}: ${s('"Landing page"')},`,
                `    ${p('stack')}: [${s('"HTML"')}, ${s('"CSS"')}, ${s('"JavaScript"')}],`,
                `    ${p('status')}: ${s('"no ar · cliente real"')},`,
                `    ${p('url')}: ${link('"ver site"', 'https://wellyngton-nascimento-santos.github.io/portfolio-pai/')},`,
                '  },',
                '  {',
                `    ${p('nome')}: ${s('"RWM Executivo"')},`,
                `    ${p('tipo')}: ${s('"Landing page"')},`,
                `    ${p('stack')}: [${s('"HTML"')}, ${s('"CSS"')}, ${s('"JavaScript"')}],`,
                `    ${p('status')}: ${s('"no ar · cliente real"')},`,
                `    ${p('url')}: ${link('"ver site"', 'https://wellyngton-nascimento-santos.github.io/rwmexecutivo/')},`,
                '  },',
                '  {',
                `    ${p('nome')}: ${s('"E-commerce Donnadela"')},`,
                `    ${p('tipo')}: ${s('"Loja virtual com carrinho e categorias"')},`,
                `    ${p('stack')}: [${s('"JavaScript"')}],`,
                `    ${p('status')}: ${s('"em desenvolvimento"')},`,
                `    ${p('repo')}: ${link('"github"', 'https://github.com/somentedois/Donnadela-Commerce')},`,
                '  },',
                '  {',
                `    ${p('nome')}: ${s('"Pizzaria CLI"')},`,
                `    ${p('tipo')}: ${s('"Sistema de pedidos em linha de comando"')},`,
                `    ${p('stack')}: [${s('"Node.js"')}],`,
                `    ${p('status')}: ${s('"em desenvolvimento"')},`,
                `    ${p('repo')}: ${link('"github"', 'https://github.com/Wellyngton-Nascimento-Santos/pizzaria-cli')},`,
                '  },',
                '];'
            ]
        },

        'stack.json': {
            icone: 'fa-solid fa-code ico ico--json',
            linguagem: 'JSON',
            linhas: [
                '{',
                `  ${p('"front"')}: [${s('"HTML"')}, ${s('"CSS"')}, ${s('"JavaScript"')}, ${s('"React"')}, ${s('"GSAP"')}],`,
                `  ${p('"back"')}: [${s('"Node.js"')}, ${s('"Express"')}, ${s('"Sequelize"')}, ${s('"APIs REST"')}],`,
                `  ${p('"banco"')}: [${s('"PostgreSQL"')}],`,
                `  ${p('"ferramentas"')}: [${s('"Git"')}, ${s('"GitHub"')}, ${s('"Render"')}, ${s('"Neon"')}],`,
                `  ${p('"nuvem"')}: [${s('"AWS (fundamentos)"')}],`,
                `  ${p('"idiomas"')}: [${s('"Português"')}, ${s('"Inglês técnico"')}]`,
                '}'
            ]
        },

        'formacao.md': {
            icone: 'fa-brands fa-markdown ico ico--md',
            linguagem: 'Markdown',
            linhas: [
                h('# Formação'),
                '',
                h('## Graduação'),
                `- ${b('Engenharia de Software')}, Universidade Estácio`,
                '  Cursando, conclusão prevista para 2028.',
                '',
                h('## Técnico'),
                `- ${b('Técnico de Informática')}, Etec Albert Einstein`,
                '  Concluído em 2017.',
                '',
                h('## Qualificação'),
                `- ${b('Desenvolvedor Web Full Stack')}, Digital House (227 horas)`,
                '  HTML, CSS, JavaScript, React, Node.js, Express, banco de dados e APIs.',
                '',
                h('## Cursos complementares'),
                '- Computação em Nuvem AWS, Ka Solution / AWS',
                '- Raciocínio Lógico e Resolução de Problemas, Universidade Estácio',
                '- HTML Avançado, Fundação Bradesco'
            ]
        },

        'contato.sh': {
            icone: 'fa-solid fa-terminal ico ico--sh',
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
                `${f('echo')} ${s('"Disponível para estágio."')}`
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
        arvore.innerHTML = ordem.map((nome) => `
            <li><button type="button" data-arquivo="${nome}" aria-current="${nome === atual}">
                <i class="${arquivos[nome].icone}" aria-hidden="true"></i>${nome}
            </button></li>`).join('');
    }

    function montarAbas() {
        abas.innerHTML = abertas.map((nome) => `
            <button type="button" class="ed_aba" role="tab" data-arquivo="${nome}" aria-selected="${nome === atual}">
                <i class="${arquivos[nome].icone}" aria-hidden="true"></i>${nome}
            </button>`).join('');
    }

    function montarCodigo(animar) {
        const arq = arquivos[atual];
        codigo.innerHTML = arq.linhas
            .map((linha, i) => `<span class="l${animar ? ' entra' : ''}" style="animation-delay:${Math.min(i * 28, 600)}ms">${linha || ' '}</span>`)
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
    }

    document.addEventListener('click', (e) => {
        const alvo = e.target.closest('[data-arquivo]');
        if (alvo) abrir(alvo.dataset.arquivo);
    });

    abrir('sobre.md', false);

    // O intro3d.js chama isso quando a câmera termina de entrar na tela
    window.editorPortfolio = {
        animarEntrada() {
            montarCodigo(true);
            codigo.focus({ preventScroll: true });
        }
    };
})();
