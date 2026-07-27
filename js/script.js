


function menuMobol(){
    const ativaMenu = document.querySelector('.fa-bars');
    const navMenu = document.querySelector('header .navegacao-primaria')


    ativaMenu.addEventListener('click', () => {
        ativaMenu.classList.toggle('fa-x');
        navMenu.classList.toggle('ativado');
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