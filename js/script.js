


function menuMobol(){
    const botaoMenu = document.querySelector('.menu_toggle');
    const iconeMenu = botaoMenu.querySelector('i');
    const navMenu = document.querySelector('header .navegacao-primaria');

    botaoMenu.addEventListener('click', () => {
        iconeMenu.classList.toggle('fa-x');
        navMenu.classList.toggle('ativado');

        // aria-expanded + aria-label avisam leitor de tela se o menu está
        // aberto ou fechado — antes disso era um <i> sem nenhuma semântica.
        const aberto = navMenu.classList.contains('ativado');
        botaoMenu.setAttribute('aria-expanded', String(aberto));
        botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
    })
}

menuMobol();


function renderProjetos(){
    const container = document.querySelector('#portfolioGrid');
    if (!container) return;

    container.innerHTML = projetos.map((projeto) => `
        <article class="portfolio_card">
            ${projeto.badge ? `<span class="portfolio_card_badge">${projeto.badge}</span>` : ''}
            <div class="portfolio_card_media">
                ${projeto.imagem
                    ? `<img src="${projeto.imagem}" alt="Captura de tela do projeto ${projeto.titulo}" loading="lazy">`
                    : `<i class="fa-solid fa-code"></i>`}
            </div>
            <div class="portfolio_card_body">
                <h3 class="portfolio_card_title">${projeto.titulo}</h3>
                <p class="portfolio_card_desc">${projeto.descricao}</p>
                <ul class="portfolio_card_tags">
                    ${projeto.tags.map((tag) => `<li>${tag}</li>`).join('')}
                </ul>
                <a href="${projeto.link}" target="_blank" rel="noopener" class="portfolio_card_link">
                    <i class="fa-brands fa-github"></i> Ver no GitHub
                </a>
            </div>
        </article>
    `).join('');
}

renderProjetos();

// Os cards de projeto acabaram de ser criados agora — é só a partir daqui
// que dá pra ligar o tilt 3D + spotlight neles (ver js/tilt.js).
if (window.aplicarTiltSpotlight) {
    window.aplicarTiltSpotlight('.portfolio_card');
}


const btn = document.getElementById("btnTop")

document.addEventListener('scroll',ocultar);

function ocultar(){
    if(window.scrollY > 10){
        btn.style.display = "flex"
    }else{
        btn.style.display = "none"
    }
}

ocultar();