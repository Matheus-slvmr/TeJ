/**
 * T&J Trabalhos Acadêmicos — Background de Constelação Neural, Coreografia e Contato
 */
(function () {
  'use strict';

  document.documentElement.classList.add('js-ready');

  const WHATSAPP_NUMBER = '5562999715309';

  // 1. Ano atual no rodapé
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // 2. Background Temático: Constelação de Conhecimento (Inspirado nas conexões neurais da Logo T&J)
  const canvas = document.getElementById('neuralCanvas');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let nodes = [];
    const pointer = { x: -9999, y: -9999 };

    function resizeCanvas() {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(18, Math.min(44, Math.floor((width * height) / 26000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1.8 + Math.random() * 2.2
      }));
    }

    function drawFrame() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        if (!prefersReducedMotion) {
          a.x += a.vx;
          a.y += a.vy;
          if (a.x < 0 || a.x > width) a.vx *= -1;
          if (a.y < 0 || a.y > height) a.vy *= -1;
        }

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          const maxDist = 155;

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.22;
            ctx.strokeStyle = `rgba(22, 91, 49, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        // Conexão sutil com o cursor
        const pdx = a.x - pointer.x;
        const pdy = a.y - pointer.y;
        const pDist = Math.hypot(pdx, pdy);
        if (pDist < 180) {
          const pAlpha = (1 - pDist / 180) * 0.32;
          ctx.strokeStyle = `rgba(62, 123, 59, ${pAlpha.toFixed(3)})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }

        ctx.fillStyle = 'rgba(22, 91, 49, 0.38)';
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!prefersReducedMotion) {
        requestAnimationFrame(drawFrame);
      }
    }

    resizeCanvas();
    drawFrame();

    window.addEventListener('resize', () => {
      resizeCanvas();
      if (prefersReducedMotion) drawFrame();
    });

    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      heroSection.addEventListener('pointermove', (e) => {
        const rect = canvas.getBoundingClientRect();
        pointer.x = e.clientX - rect.left;
        pointer.y = e.clientY - rect.top;
      });
      heroSection.addEventListener('pointerleave', () => {
        pointer.x = -9999;
        pointer.y = -9999;
      });
    }
  }

  // 3. Barra de progresso de leitura e estado do cabeçalho
  const header = document.querySelector('.site-header');
  const scrollProgress = document.getElementById('scrollProgress');

  function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    if (header) {
      header.classList.toggle('is-scrolled', scrollY > 16);
    }
    if (scrollProgress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
      scrollProgress.style.transform = `scaleX(${ratio})`;
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 4. Menu Mobile Acessível
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  function closeMobileMenu() {
    if (!menuToggle || !mainNav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu de navegação');
    mainNav.classList.remove('is-open');
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isExpanded));
      menuToggle.setAttribute(
        'aria-label',
        !isExpanded ? 'Fechar menu de navegação' : 'Abrir menu de navegação'
      );
      mainNav.classList.toggle('is-open', !isExpanded);
    });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
        closeMobileMenu();
        menuToggle.focus();
      }
    });
  }

  // 5. Coreografia de Entrada por Grupos (IntersectionObserver)
  const revealElements = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  // 6. Filtro Funcional de Serviços + Seleção Direta
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach((b) => {
        const isCurrent = b === btn;
        b.classList.toggle('is-active', isCurrent);
        b.setAttribute('aria-pressed', String(isCurrent));
      });

      serviceCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        const matches = filter === 'todos' || category === filter;
        card.classList.toggle('is-filtered-out', !matches);
      });
    });
  });

  const serviceSelectBtns = document.querySelectorAll('[data-select-service]');
  const serviceTypeSelect = document.getElementById('serviceType');
  const studentNameInput = document.getElementById('studentName');
  const quoteSection = document.getElementById('orcamento');

  serviceSelectBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const serviceValue = btn.getAttribute('data-select-service');
      if (serviceTypeSelect && serviceValue) {
        serviceTypeSelect.value = serviceValue;
      }
      if (quoteSection) {
        quoteSection.scrollIntoView({ behavior: 'smooth' });
      }
      if (studentNameInput) {
        setTimeout(() => studentNameInput.focus(), 450);
      }
    });
  });

  // 7. Envio Direto para o WhatsApp
  const quoteForm = document.getElementById('academicQuoteForm');
  const courseAreaInput = document.getElementById('courseArea');
  const deadlineInfoInput = document.getElementById('deadlineInfo');
  const projectDetailsInput = document.getElementById('projectDetails');

  function buildWhatsAppMessage() {
    const name = studentNameInput ? studentNameInput.value.trim() : '';
    const course = courseAreaInput ? courseAreaInput.value.trim() : '';
    const service = serviceTypeSelect ? serviceTypeSelect.value : '';
    const deadline = deadlineInfoInput ? deadlineInfoInput.value.trim() : '';
    const details = projectDetailsInput ? projectDetailsInput.value.trim() : '';

    const lines = [
      'Olá, equipe T&J Trabalhos Acadêmicos! Tudo bem?',
      'Gostaria de conversar sobre meu projeto acadêmico:'
    ];

    if (name) lines.push(`• *Nome:* ${name}`);
    if (course) lines.push(`• *Curso/Área:* ${course}`);
    if (service) lines.push(`• *Demanda:* ${service}`);
    if (deadline) lines.push(`• *Prazo/Etapa:* ${deadline}`);
    if (details) lines.push(`• *Sobre o projeto:* ${details}`);

    return lines.join('\n');
  }

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const errorName = document.getElementById('errorName');
      const errorCourse = document.getElementById('errorCourse');
      const errorService = document.getElementById('errorService');

      let isValid = true;
      let firstInvalid = null;

      if (studentNameInput && !studentNameInput.value.trim()) {
        studentNameInput.setAttribute('aria-invalid', 'true');
        if (errorName) errorName.textContent = 'Por favor, informe seu nome.';
        isValid = false;
        firstInvalid = firstInvalid || studentNameInput;
      } else if (studentNameInput) {
        studentNameInput.setAttribute('aria-invalid', 'false');
        if (errorName) errorName.textContent = '';
      }

      if (courseAreaInput && !courseAreaInput.value.trim()) {
        courseAreaInput.setAttribute('aria-invalid', 'true');
        if (errorCourse) errorCourse.textContent = 'Informe seu curso ou área.';
        isValid = false;
        firstInvalid = firstInvalid || courseAreaInput;
      } else if (courseAreaInput) {
        courseAreaInput.setAttribute('aria-invalid', 'false');
        if (errorCourse) errorCourse.textContent = '';
      }

      if (serviceTypeSelect && !serviceTypeSelect.value) {
        serviceTypeSelect.setAttribute('aria-invalid', 'true');
        if (errorService) errorService.textContent = 'Selecione a demanda acadêmica.';
        isValid = false;
        firstInvalid = firstInvalid || serviceTypeSelect;
      } else if (serviceTypeSelect) {
        serviceTypeSelect.setAttribute('aria-invalid', 'false');
        if (errorService) errorService.textContent = '';
      }

      if (!isValid) {
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const message = buildWhatsAppMessage();
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }
})();
