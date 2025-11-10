// Menu Hamburguer Mobile
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Fechar menu ao clicar em link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Scroll suave para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animação de fade-in ao scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observar elementos para animação
const elementsToAnimate = document.querySelectorAll('.projeto-card, .skill-category, .stat-item');
elementsToAnimate.forEach(element => {
    observer.observe(element);
});

// Animação das barras de progresso
const skillBars = document.querySelectorAll('.skill-progress');
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBar = entry.target;
            const width = progressBar.style.width;
            progressBar.style.width = '0%';
            setTimeout(() => {
                progressBar.style.width = width;
            }, 200);
        }
    });
}, observerOptions);

skillBars.forEach(bar => {
    skillsObserver.observe(bar);
});

// Formulário de contato
document.querySelector('.form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Obter valores do formulário
    const nome = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const assunto = this.querySelector('input[type="text"]:nth-child(3)').value;
    const mensagem = this.querySelector('textarea').value;
    
    // Validação básica
    if (!nome || !email || !assunto || !mensagem) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    // Simular envio (em produção, isso seria um envio real para um servidor)
    alert(`Obrigado pelo contato, ${nome}! Recebemos sua mensagem e responderemos em breve.`);
    
    // Limpar formulário
    this.reset();
});

// Efeito de scroll na navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = 'var(--primary-black)';
        navbar.style.backdropFilter = 'none';
    }
});

// Animação de contador para estatísticas
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (element.textContent.includes('+') ? '+' : '');
        }
    }, 16);
}

// Observar estatísticas para animação
const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const target = parseInt(entry.target.textContent);
            animateCounter(entry.target, target);
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

statNumbers.forEach(stat => {
    statsObserver.observe(stat);
});

// Adicionar classe active ao link da seção atual
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    
    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    });
});

// Lazy loading para imagens (se houver)
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => {
    imageObserver.observe(img);
});

// Carrossel de Skills
class SkillsCarousel {
    constructor() {
        this.track = document.getElementById('skills-list');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.items = document.querySelectorAll('.timeline-item-horizontal');
        this.currentIndex = 0;
        this.itemsPerView = 5;
        this.itemWidth = 200; // Largura do item + gap
        
        this.init();
    }
    
    init() {
        this.updateCarousel();
        this.bindEvents();
        this.handleResize();
        
        // Adicionar touch events para mobile
        this.addTouchEvents();
    }
    
    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        window.addEventListener('resize', () => this.handleResize());
        
        // Adicionar navegação por teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
    }
    
    handleResize() {
        const width = window.innerWidth;
        if (width <= 768) {
            this.itemsPerView = 2;
            this.itemWidth = 160;
        } else if (width <= 1024) {
            this.itemsPerView = 3;
            this.itemWidth = 180;
        } else {
            this.itemsPerView = 5;
            this.itemWidth = 200;
        }
        
        this.currentIndex = 0;
        this.updateCarousel();
    }
    
    updateCarousel() {
        const maxIndex = Math.max(0, this.items.length - this.itemsPerView);
        this.currentIndex = Math.min(this.currentIndex, maxIndex);

        const translateX = -this.currentIndex * this.itemWidth;
        this.track.style.transform = `translateX(${translateX}px)`;

        // Atualizar estado dos botões
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex >= maxIndex;

        // Exibir setas apenas quando houver overflow
        const hasOverflow = this.items.length > this.itemsPerView;
        this.prevBtn.style.display = hasOverflow ? 'flex' : 'none';
        this.nextBtn.style.display = hasOverflow ? 'flex' : 'none';

        // Adicionar classe active ao item central
        this.items.forEach((item, index) => {
            item.classList.toggle('active',
                index >= this.currentIndex && index < this.currentIndex + this.itemsPerView
            );
        });
    }
    
    next() {
        const maxIndex = Math.max(0, this.items.length - this.itemsPerView);
        if (this.currentIndex < maxIndex) {
            this.currentIndex++;
            this.updateCarousel();
        }
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
        }
    }
    
    addTouchEvents() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        const carousel = document.getElementById('skills-carousel');
        
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            carousel.style.cursor = 'grabbing';
        });
        
        carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            const diffX = startX - currentX;
            
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.next();
                } else {
                    this.prev();
                }
                isDragging = false;
            }
        });
        
        carousel.addEventListener('touchend', () => {
            isDragging = false;
            carousel.style.cursor = 'grab';
        });
    }
}

// Função para criar o efeito Matrix com colunas verticais fixas (versão anterior estável)
function createBinaryRain() {
    const binaryBackground = document.getElementById('binary-background');
    if (!binaryBackground) return;

    // Configurações: largura/intervalo e altura da seção home
    const home = document.getElementById('home');
    const homeRect = home.getBoundingClientRect();
    const fallDistance = homeRect.height;
    binaryBackground.style.setProperty('--fall-distance', `${fallDistance}px`);

    const columnWidth = 44;     // largura de cada linha/coluna
    const columnGap = 16;       // espaçamento horizontal entre linhas
    const colors = ['#7c3aed', '#a855f7', '#c084fc', '#ddd6fe'];
    const totalColumns = Math.floor((homeRect.width) / (columnWidth + columnGap));

    // Sequência fixa fornecida (com grupos de 8 dígitos)
    const fixedSequence = [
        ['0','1','0','0','1','1','0','1'],
        ['0','1','1','0','0','0','0','1'],
        ['0','1','1','1','0','0','1','0'],
        ['0','1','1','0','1','0','0','1'],
        ['0','1','1','0','1','1','1','1'],
        ['0','0','1','0','0','0','0','0'],
        ['0','1','0','0','1','1','1','1'],
        ['0','1','1','0','1','1','0','0'],
        ['0','1','1','0','1','0','0','1'],
        ['0','1','1','1','0','1','1','0'],
        ['0','1','1','0','0','1','0','1'],
        ['0','1','1','0','1','0','0','1'],
        ['0','1','1','1','0','0','1','0'],
        ['0','1','1','0','0','0','0','1']
    ];

    // Renderiza uma coluna com a sequência fixa; repete ao finalizar
    function createFixedSequenceColumn(columnIndex) {
        const column = document.createElement('div');
        column.className = 'binary-rain';
        column.style.position = 'absolute';
        column.style.left = (columnIndex * (columnWidth + columnGap)) + 'px';
        column.style.top = `-${fallDistance}px`;
        column.style.width = columnWidth + 'px';
        column.style.fontSize = '14px';
        column.style.lineHeight = '1.2';
        column.style.textAlign = 'center';
        column.style.color = colors[Math.floor(Math.random() * colors.length)];
        column.style.textShadow = '0 0 6px currentColor';
        column.style.fontFamily = 'Courier New, monospace';
        column.style.pointerEvents = 'none';

        // Monta conteúdo com dígitos verticais e espaço extra entre grupos
        let html = '';
        fixedSequence.forEach((group, gIdx) => {
            group.forEach(d => { html += `${d}<br>`; });
            if (gIdx < fixedSequence.length - 1) html += '<br>'; // espaço entre grupos
        });
        column.innerHTML = html;

        // Duração e atraso para variar levemente as linhas
        const duration = Math.random() * 6 + 14; // 14–20s
        const delay = Math.random() * 3;         // 0–3s

        binaryBackground.appendChild(column);
        column.offsetHeight; // reflow
        column.style.animation = `binaryFall ${duration}s linear ${delay}s`;

        // Ao terminar, remove e recria a mesma coluna (loop)
        column.addEventListener('animationend', () => {
            column.remove();
            setTimeout(() => createFixedSequenceColumn(columnIndex), 300);
        });
    }

    // Inicializa todas as colunas espaçadas da esquerda para a direita
    for (let i = 0; i < totalColumns; i++) {
        setTimeout(() => createFixedSequenceColumn(i), i * 120);
    }

    // Recalcula em resize para manter sem sobreposição
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Limpa colunas atuais
            document.querySelectorAll('#binary-background .binary-rain').forEach(el => el.remove());
            const newRect = home.getBoundingClientRect();
            binaryBackground.style.setProperty('--fall-distance', `${newRect.height}px`);
            const columns = Math.floor((newRect.width) / (columnWidth + columnGap));
            for (let i = 0; i < columns; i++) {
                setTimeout(() => createFixedSequenceColumn(i), i * 120);
            }
        }, 200);
    });
}

// Inicializar carrossel de skills
window.addEventListener('load', function() {
    setTimeout(() => {
        new SkillsCarousel();
        createBinaryRain();
    }, 1500);
});

// Console log para debug
// Dados dos projetos para o modal
const projetosData = {
    'E-commerce Platform': {
        titulo: 'E-commerce Platform',
        descricao: 'Plataforma completa de e-commerce desenvolvida com React e Node.js. O sistema inclui carrinho de compras, processamento de pagamentos, gestão de estoque, painel administrativo e integração com gateway de pagamento. A arquitetura é escalável e segue as melhores práticas de desenvolvimento.',
        imagens: [
            'https://via.placeholder.com/800x600/7c3aed/ffffff?text=E-commerce+Home',
            'https://via.placeholder.com/800x600/a855f7/ffffff?text=E-commerce+Produtos',
            'https://via.placeholder.com/800x600/c084fc/ffffff?text=E-commerce+Carrinho',
            'https://via.placeholder.com/800x600/ddd6fe/ffffff?text=E-commerce+Checkout'
        ],
        tecnologias: ['React', 'Node.js', 'MongoDB', 'Express.js', 'Stripe API', 'JWT', 'Redux'],
        funcionalidades: [
            'Sistema de autenticação completo',
            'Carrinho de compras com persistência',
            'Integração com gateway de pagamento',
            'Gestão de estoque em tempo real',
            'Painel administrativo completo',
            'Sistema de avaliações de produtos',
            'Filtros avançados de busca',
            'Responsivo para todos os dispositivos'
        ],
        demoLink: 'https://exemplo-ecommerce.com',
        codigoLink: 'https://github.com/mario-oliveira/ecommerce-platform'
    },
    'App de Tarefas': {
        titulo: 'App de Tarefas',
        descricao: 'Aplicativo mobile para gerenciamento de tarefas com sincronização em tempo real. Desenvolvido com React Native e Firebase, permite criar, editar e compartilhar tarefas entre equipes. Inclui notificações push, modo offline e análises de produtividade.',
        imagens: [
            'https://via.placeholder.com/800x600/7c3aed/ffffff?text=App+Dashboard',
            'https://via.placeholder.com/800x600/a855f7/ffffff?text=App+Tarefas',
            'https://via.placeholder.com/800x600/c084fc/ffffff?text=App+Calendario',
            'https://via.placeholder.com/800x600/ddd6fe/ffffff?text=App+Estatisticas'
        ],
        tecnologias: ['React Native', 'Firebase', 'Redux', 'AsyncStorage', 'Push Notifications'],
        funcionalidades: [
            'Criação e edição de tarefas',
            'Sincronização em tempo real',
            'Modo offline com sincronização posterior',
            'Notificações push personalizadas',
            'Compartilhamento de tarefas',
            'Análises de produtividade',
            'Integração com calendário',
            'Interface intuitiva e moderna'
        ],
        demoLink: 'https://exemplo-tasks.com',
        codigoLink: 'https://github.com/mario-oliveira/task-manager-app'
    },
    'Dashboard Analytics': {
        titulo: 'Dashboard Analytics',
        descricao: 'Dashboard interativo para visualização de dados e análises de negócios. Desenvolvido com Vue.js e D3.js, oferece gráficos dinâmicos, relatórios personalizáveis e integração com APIs externas. Processamento de dados em tempo real com Python.',
        imagens: [
            'https://via.placeholder.com/800x600/7c3aed/ffffff?text=Dashboard+Principal',
            'https://via.placeholder.com/800x600/a855f7/ffffff?text=Dashboard+Graficos',
            'https://via.placeholder.com/800x600/c084fc/ffffff?text=Dashboard+Relatorios',
            'https://via.placeholder.com/800x600/ddd6fe/ffffff?text=Dashboard+Export'
        ],
        tecnologias: ['Vue.js', 'D3.js', 'Python', 'Flask', 'PostgreSQL', 'Redis', 'Docker'],
        funcionalidades: [
            'Visualização de dados em tempo real',
            'Gráficos interativos e responsivos',
            'Exportação de relatórios (PDF/Excel)',
            'Filtros e segmentação de dados',
            'API RESTful para integrações',
            'Sistema de alertas e notificações',
            'Painel personalizável por usuário',
            'Processamento assíncrono de grandes volumes'
        ],
        demoLink: 'https://exemplo-analytics.com',
        codigoLink: 'https://github.com/mario-oliveira/analytics-dashboard'
    }
};

// Variáveis globais para o modal
let modal = null;
let modalTitulo = null;
let modalDescricao = null;
let modalImagem = null;
let modalTecnologias = null;
let modalFuncionalidades = null;
let modalDemoLink = null;
let modalCodigoLink = null;
let modalPrevBtn = null;
let modalNextBtn = null;
let carouselIndicators = null;
let imagensAtuais = [];
let imagemAtualIndex = 0;

// Função para abrir o modal de projeto
function abrirModalProjeto(nomeProjetoOuObj) {
    let projeto = null;
    if (typeof nomeProjetoOuObj === 'string') {
        // Primeiro tenta projetos do admin (localStorage)
        try {
            const admin = JSON.parse(localStorage.getItem('site.data') || '{}');
            const match = (admin.projects || []).find(p => p.title === nomeProjetoOuObj);
            if (match) {
                projeto = {
                    titulo: match.title,
                    descricao: match.desc || '',
                    imagens: Array.isArray(match.images) ? match.images : [],
                    tecnologias: Array.isArray(match.tech) ? match.tech : [],
                    funcionalidades: Array.isArray(match.features) ? match.features : [],
                    demoLink: match.demoLink || '#',
                    codigoLink: match.codigoLink || '#'
                };
            }
        } catch(e) { /* ignore */ }
        if (!projeto) {
            projeto = projetosData[nomeProjetoOuObj];
        }
    } else if (nomeProjetoOuObj && typeof nomeProjetoOuObj === 'object') {
        const p = nomeProjetoOuObj;
        projeto = {
            titulo: p.title || p.titulo || 'Projeto',
            descricao: p.desc || p.descricao || '',
            imagens: Array.isArray(p.images) ? p.images : (Array.isArray(p.imagens) ? p.imagens : []),
            tecnologias: Array.isArray(p.tech) ? p.tech : (Array.isArray(p.tecnologias) ? p.tecnologias : []),
            funcionalidades: Array.isArray(p.features) ? p.features : (Array.isArray(p.funcionalidades) ? p.funcionalidades : []),
            demoLink: p.demoLink || '#',
            codigoLink: p.codigoLink || '#'
        };
    }
    if (!projeto) return;

    // Preencher dados do modal
    modalTitulo.textContent = projeto.titulo;
    modalDescricao.textContent = projeto.descricao;
    
    // Configurar imagens do carrossel
    imagensAtuais = projeto.imagens || [];
    imagemAtualIndex = 0;
    atualizarImagemModal();
    criarIndicadoresCarrossel();
    // Mostrar setas e indicadores apenas quando houver mais de uma imagem
    const showNav = (imagensAtuais && imagensAtuais.length > 1);
    if (modalPrevBtn && modalNextBtn && carouselIndicators) {
        modalPrevBtn.style.display = showNav ? 'flex' : 'none';
        modalNextBtn.style.display = showNav ? 'flex' : 'none';
        carouselIndicators.style.display = showNav ? 'flex' : 'none';
    }
    
    // Preencher tecnologias
    modalTecnologias.innerHTML = '';
    projeto.tecnologias.forEach(tech => {
        const span = document.createElement('span');
        span.className = 'tech-tag';
        span.textContent = tech;
        modalTecnologias.appendChild(span);
    });
    
    // Preencher funcionalidades
    modalFuncionalidades.innerHTML = '';
    projeto.funcionalidades.forEach(func => {
        const li = document.createElement('li');
        li.textContent = func;
        modalFuncionalidades.appendChild(li);
    });
    
    // Configurar links
    modalDemoLink.href = projeto.demoLink;
    modalCodigoLink.href = projeto.codigoLink;
    
    // Mostrar modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Função para fechar o modal
function fecharModalProjeto() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Função para atualizar a imagem do modal
function atualizarImagemModal() {
    if (imagensAtuais.length > 0) {
        modalImagem.src = imagensAtuais[imagemAtualIndex];
        modalImagem.alt = `Imagem ${imagemAtualIndex + 1} do projeto`;
        atualizarIndicadores();
    }
}

// Função para criar indicadores do carrossel
function criarIndicadoresCarrossel() {
    carouselIndicators.innerHTML = '';
    for (let i = 0; i < imagensAtuais.length; i++) {
        const indicator = document.createElement('div');
        indicator.className = 'indicator';
        if (i === imagemAtualIndex) {
            indicator.classList.add('active');
        }
        indicator.addEventListener('click', () => {
            imagemAtualIndex = i;
            atualizarImagemModal();
        });
        carouselIndicators.appendChild(indicator);
    }
}

// Função para atualizar os indicadores
function atualizarIndicadores() {
    const indicators = carouselIndicators.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        if (index === imagemAtualIndex) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// Função para navegar no carrossel
function navegarCarrossel(direcao) {
    if (imagensAtuais.length === 0) return;
    
    if (direcao === 'next') {
        imagemAtualIndex = (imagemAtualIndex + 1) % imagensAtuais.length;
    } else {
        imagemAtualIndex = (imagemAtualIndex - 1 + imagensAtuais.length) % imagensAtuais.length;
    }
    
    atualizarImagemModal();
}

// Função para inicializar o modal
function inicializarModal() {
    modal = document.getElementById('projetoModal');
    modalTitulo = document.getElementById('modalTitulo');
    modalDescricao = document.getElementById('modalDescricao');
    modalImagem = document.getElementById('modalImagem');
    modalTecnologias = document.getElementById('modalTecnologias');
    modalFuncionalidades = document.getElementById('modalFuncionalidades');
    modalDemoLink = document.getElementById('modalDemoLink');
    modalCodigoLink = document.getElementById('modalCodigoLink');
    modalPrevBtn = document.getElementById('modalPrevBtn');
    modalNextBtn = document.getElementById('modalNextBtn');
    carouselIndicators = document.getElementById('carouselIndicators');
    
    // Event listeners do modal
    document.querySelector('.modal-close').addEventListener('click', fecharModalProjeto);
    modalPrevBtn.addEventListener('click', () => navegarCarrossel('prev'));
    modalNextBtn.addEventListener('click', () => navegarCarrossel('next'));
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            fecharModalProjeto();
        }
    });
    
    // Navegação com teclado
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'block') {
            if (e.key === 'Escape') {
                fecharModalProjeto();
            } else if (e.key === 'ArrowLeft') {
                navegarCarrossel('prev');
            } else if (e.key === 'ArrowRight') {
                navegarCarrossel('next');
            }
        }
    });
    
    // Adicionar event listeners aos cards de projeto
    const projetoCards = document.querySelectorAll('.projeto-card');
    projetoCards.forEach(card => {
        const titulo = card.querySelector('h3').textContent;
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => abrirModalProjeto(titulo));
    });
}

console.log('Portfolio carregado com sucesso! 🚀');
console.log('Funcionalidades disponíveis:');
console.log('- Menu mobile responsivo');
console.log('- Scroll suave entre seções');
console.log('- Animações ao scroll');
console.log('- Formulário de contato funcional');
console.log('- Animação de barras de progresso');
console.log('- Contador animado de estatísticas');
console.log('- Carrossel de skills interativo');

// Inicializar modal quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    inicializarModal();
    console.log('Modal de projetos inicializado!');
    // Hidratar conteúdo do site com dados do admin (localStorage)
    try {
        const data = JSON.parse(localStorage.getItem('site.data') || '{}');
        if (data && Object.keys(data).length) {
            // Nome
            if (data.name) {
                const logoText = document.querySelector('.logo-text');
                const homeTitle = document.querySelector('.home-title');
                if (logoText) logoText.textContent = data.name;
                if (homeTitle) homeTitle.textContent = data.name;
                document.querySelectorAll('[data-bind="name"]').forEach(el => el.textContent = data.name);
            }
            // Subtítulo (cargo/role)
            if (data.role) {
                const homeSubtitle = document.querySelector('.home-subtitle');
                if (homeSubtitle) homeSubtitle.textContent = data.role;
            }
            // Foto Home
            if (data.homePhoto) {
                const profile = document.querySelector('.profile-image');
                if (profile) {
                    profile.innerHTML = `<img src="${data.homePhoto}" alt="Foto de perfil" />`;
                }
            }
            // Sobre
            if (data.about) {
                const aboutEl = document.querySelector('.sobre-text p');
                if (aboutEl) aboutEl.textContent = data.about;
            }
            // Contato: email/telefone
            if (data.email || data.phone) {
                const contatoItems = document.querySelectorAll('.contato-item');
                contatoItems.forEach(item => {
                    const icon = item.querySelector('i');
                    const span = item.querySelector('span');
                    if (icon && span) {
                        if (icon.classList.contains('fa-envelope') && data.email) span.textContent = data.email;
                        if (icon.classList.contains('fa-phone') && data.phone) span.textContent = data.phone;
                    }
                });
            }
            // Social links
            if (data.linkedin) {
                const linkLinkedin = document.querySelector('.contato-social a[href*="linkedin"]');
                if (linkLinkedin) linkLinkedin.href = data.linkedin;
            }
            if (data.github) {
                const linkGithub = document.querySelector('.contato-social a[href*="github"]');
                if (linkGithub) linkGithub.href = data.github;
            }
            // Projetos
            if (Array.isArray(data.projects)) {
                const grid = document.querySelector('.projetos-grid');
                if (grid) {
                    grid.innerHTML = '';
                    data.projects.forEach(p => {
                        const card = document.createElement('div');
                        card.className = 'projeto-card';
                        const hasImage = Array.isArray(p.images) && p.images.length > 0;
                        card.innerHTML = `
                            <div class="projeto-image">${hasImage ? `<img src="${p.images[0]}" alt="${p.title}" />` : `<i class="fas fa-code"></i>`}</div>
                            <div class="projeto-content">
                              <h3>${p.title}</h3>
                              <p>${p.desc || ''}</p>
                              <div class="projeto-tech">${(p.tech||[]).map(t => `<span class='tech-tag'>${t}</span>`).join('')}</div>
                            </div>`;
                        card.style.cursor = 'pointer';
                        card.addEventListener('click', () => abrirModalProjeto(p.title));
                        grid.appendChild(card);
                    });
                }
            }
            // Skills
            if (Array.isArray(data.skills)) {
                const track = document.getElementById('skills-list');
                if (track) {
                    track.innerHTML = '';
                    data.skills.forEach(s => {
                        const item = document.createElement('div');
                        item.className = 'timeline-item-horizontal';
                        const hasImg = !!s.image;
                        const imgEl = hasImg 
                          ? `<img class="skill-image" src="${s.image}" alt="${s.name}" />`
                          : `<div class="skill-image skill-placeholder" aria-hidden="true"></div>`;
                        item.innerHTML = `
                          <div class="timeline-content-horizontal">
                            ${imgEl}
                            <h3>${s.name}</h3>
                            <p>Nível: ${s.level || 0}</p>
                          </div>`;
                        track.appendChild(item);
                    });
                }
            }
        }
    } catch(err) {
        console.warn('Falha na hidratação admin:', err);
    }
});