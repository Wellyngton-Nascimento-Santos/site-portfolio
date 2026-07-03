


function escrevendoLetra(){
    function ativaLetra (elemento){
        const arrTexto = elemento.innerHTML.split('');
        elemento.innerHTML = '';
        arrTexto.forEach((Letra, i)=>{
            setTimeout(()=>{
                elemento.innerHTML += Letra;
            }, 75 * i)
        })
    }
    
    const titulo = document.querySelector('.digitando');
    ativaLetra(titulo); 
}

escrevendoLetra();



function menuMobol(){
    const ativaMenu = document.querySelector('.fa-bars');
    const navMenu = document.querySelector('header .navegacao-primaria')


    ativaMenu.addEventListener('click', () => {
        ativaMenu.classList.toggle('fa-x');
        navMenu.classList.toggle('ativado');
    })
}

menuMobol();


function sobreMim(){

    const divExperiencia = document.querySelectorAll('.experience_content div');
    const liExperiencia = document.querySelectorAll('.experience_content ul li');
    const divEducation = document.querySelectorAll('.education_content div');
    const liEducation = document.querySelectorAll('.education_content ul li');

    divExperiencia[0].classList.add('ativo');
    divEducation[0].classList.add('ativo');
    liExperiencia[0].classList.add('ativo');
    liEducation[0].classList.add('ativo');

    function slideShow(index) {
        divExperiencia.forEach((div) => {
            div.classList.remove('ativo');
        });
        liExperiencia.forEach((botao) => {
            botao.classList.remove('ativo');
        });
        divExperiencia[index].classList.add('ativo');
        liExperiencia[index].classList.add('ativo');
    }

    function slideShow2(index) {
        divEducation.forEach((div) => {
            div.classList.remove('ativo');
        });
        liEducation.forEach((botao) => {
            botao.classList.remove('ativo');
        });
        divEducation[index].classList.add('ativo');
        liEducation[index].classList.add('ativo');
    }


    liExperiencia.forEach((event, index) => {
        event.addEventListener('click', () => {
            slideShow(index)
        });
    });

    liEducation.forEach((event, index) => {
        event.addEventListener('click', () => {
            slideShow2(index)
        });
    });

}

sobreMim();


function renderProjetos(){
    const container = document.querySelector('#portfolioGrid');
    if (!container) return;

    container.innerHTML = projetos.map((projeto) => `
        <article class="portfolio_card">
            ${projeto.badge ? `<span class="portfolio_card_badge">${projeto.badge}</span>` : ''}
            <div class="portfolio_card_media"><i class="fa-solid fa-code"></i></div>
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


const listaALL = document.querySelectorAll('.projects_armazenamento ul li');
const buttonGeral = document.querySelectorAll('.projects_models ul li');
const buttonALL = document.querySelectorAll('.projects_models .all');

function removeClick(index){
    buttonGeral.forEach((item)=>{
        item.classList.remove('ativo');
    });
    buttonGeral[index].classList.add('ativo');
}

buttonGeral.forEach((item, index)=>{
    item.addEventListener('click', ()=>{
        removeClick(index);
    })
})


function showLista(lista, buttom = "todos"){
    lista.forEach((item)=>{
        item.classList.remove('ativo');
    })
    if(buttom == 'finalizados'){
        lista.forEach((item, index) => {
            if(index > 0) item.classList.add('ativo');
        });
    }
    if(buttom == 'andamento'){
        lista[0].classList.add('ativo');
    }
    if(buttom == 'todos'){
        lista.forEach((item) => item.classList.add('ativo'));
    }
}

buttonGeral.forEach((item)=>{
    item.addEventListener('click', (e)=>{
        let currentButton = e.target;
        if(currentButton.classList.contains('todos')){
            showLista(listaALL);
        }
        if(currentButton.classList.contains('finalizados')){
            showLista(listaALL, "finalizados");
        }
        if(currentButton.classList.contains('andamento')){
            showLista(listaALL, "andamento");
        }
        if(currentButton.classList.contains('todos')){
            showLista(listaALL, "todos");
        }
    })
});

const btn = document.getElementById("btnTop")

btn.addEventListener('click', function(){
    window.scrollTo(0,0)
});

document.addEventListener('scroll',ocultar);

function ocultar(){
    if(window.scrollY > 10){
        btn.style.display = "flex"
    }else{
        btn.style.display = "none"
    }
}

ocultar();


function enviarFormulario(){
    const form = document.querySelector('#contactForm');
    if (!form) return;

    form.addEventListener('submit', function(e){
        e.preventDefault();

        const nome = document.querySelector('#contactName').value.trim();
        const contato = document.querySelector('#contactPhone').value.trim();
        const mensagem = document.querySelector('#contactMessage').value.trim();

        const texto = `Olá! Me chamo ${nome}.\nContato: ${contato}\nMensagem: ${mensagem}`;
        const url = `https://wa.me/5511940008552?text=${encodeURIComponent(texto)}`;

        window.open(url, '_blank');
    });
}

enviarFormulario();