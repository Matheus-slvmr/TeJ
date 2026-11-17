/**
 * T&J Trabalhos Acadêmicos — Interações, Coreografia e Jornada de Orçamento
 */
(function () {
  'use strict';

  // Ativa classe de aprimoramento progressivo para animações
  document.documentElement.classList.add('js-ready');

  const WHATSAPP_NUMBER = '5562999715309';
  const PIX_KEY = '62999715309';

  // 1. Ano atual no rodapé
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // 2. Barra de progresso de leitura e estado do cabeçalho
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

  // 3. Menu Mobile Acessível
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

  // 4. Coreografia de Entrada por Grupos (IntersectionObserver)
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

  // 5. Inspecionador de Padrão Acadêmico na Hero (Tabs)
  const switchBtns = document.querySelectorAll('.switch-btn');
  const panelRascunho = document.getElementById('panel-rascunho');
  const panelPadrao = document.getElementById('panel-padrao');

  switchBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetView = btn.getAttribute('data-view');
      switchBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', String(active));
      });

      if (panelRascunho && panelPadrao) {
        panelRascunho.classList.toggle('is-hidden', targetView !== 'rascunho');
        panelPadrao.classList.toggle('is-hidden', targetView !== 'padrao');
      }
    });
  });

  // 6. Filtro Funcional de Serviços + Seleção Direta para o Orçamento
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
        serviceTypeSelect.dispatchEvent(new Event('change'));
      }
      if (quoteSection) {
        quoteSection.scrollIntoView({ behavior: 'smooth' });
      }
      if (studentNameInput) {
        setTimeout(() => studentNameInput.focus(), 450);
      }
    });
  });

  // 7. Utilitário de Cópia para Área de Transferência (PIX e Resumo)
  function copyTextToClipboard(text, onSuccess) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onSuccess).catch(() => fallbackCopy(text, onSuccess));
    } else {
      fallbackCopy(text, onSuccess);
    }
  }

  function fallbackCopy(text, onSuccess) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      onSuccess();
    } catch (_) {
      // Silencioso se não suportado
    }
    document.body.removeChild(textarea);
  }

  const copyPixBtn = document.getElementById('copyPixBtn');
  const copyPixText = document.getElementById('copyPixText');
  const modalCopyPixBtn = document.getElementById('modalCopyPixBtn');

  if (copyPixBtn && copyPixText) {
    copyPixBtn.addEventListener('click', () => {
      copyTextToClipboard(PIX_KEY, () => {
        const original = copyPixText.textContent;
        copyPixText.textContent = 'Chave PIX Copiada! ✓';
        setTimeout(() => {
          copyPixText.textContent = original;
        }, 2500);
      });
    });
  }

  if (modalCopyPixBtn) {
    modalCopyPixBtn.addEventListener('click', () => {
      copyTextToClipboard(PIX_KEY, () => {
        const original = modalCopyPixBtn.textContent;
        modalCopyPixBtn.textContent = 'PIX Copiado! ✓';
        setTimeout(() => {
          modalCopyPixBtn.textContent = original;
        }, 2500);
      });
    });
  }

  // 8. Modal de Termos e Condições do Serviço
  const termsModal = document.getElementById('termsModal');
  const openTermsModalBtn = document.getElementById('openTermsModalBtn');
  const footerTermsBtn = document.getElementById('footerTermsBtn');
  const closeTermsModalBtn = document.getElementById('closeTermsModalBtn');
  const acceptTermsBtn = document.getElementById('acceptTermsBtn');
  let lastFocusedElement = null;

  function openTermsModal() {
    if (!termsModal) return;
    lastFocusedElement = document.activeElement;
    termsModal.hidden = false;
    document.body.style.overflow = 'hidden';
    if (closeTermsModalBtn) {
      closeTermsModalBtn.focus();
    }
  }

  function closeTermsModal() {
    if (!termsModal) return;
    termsModal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  if (openTermsModalBtn) openTermsModalBtn.addEventListener('click', openTermsModal);
  if (footerTermsBtn) footerTermsBtn.addEventListener('click', openTermsModal);
  if (closeTermsModalBtn) closeTermsModalBtn.addEventListener('click', closeTermsModal);
  if (acceptTermsBtn) acceptTermsBtn.addEventListener('click', closeTermsModal);

  if (termsModal) {
    termsModal.addEventListener('click', (e) => {
      if (e.target === termsModal) {
        closeTermsModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !termsModal.hidden) {
        closeTermsModal();
      }
    });
  }

  // 9. Estruturador de Orçamento Acadêmico em Tempo Real
  const quoteForm = document.getElementById('academicQuoteForm');
  const courseAreaInput = document.getElementById('courseArea');
  const normStandardSelect = document.getElementById('normStandard');
  const projectStageSelect = document.getElementById('projectStage');
  const deadlineInfoInput = document.getElementById('deadlineInfo');
  const projectDetailsInput = document.getElementById('projectDetails');
  const liveMessagePreview = document.getElementById('liveMessagePreview');
  const copySummaryBtn = document.getElementById('copySummaryBtn');

  function buildWhatsAppMessage() {
    const name = studentNameInput ? studentNameInput.value.trim() : '';
    const course = courseAreaInput ? courseAreaInput.value.trim() : '';
    const service = serviceTypeSelect ? serviceTypeSelect.value : '';
    const norm = normStandardSelect ? normStandardSelect.value : 'ABNT';
    const stage = projectStageSelect ? projectStageSelect.value : '';
    const deadline = deadlineInfoInput ? deadlineInfoInput.value.trim() : '';
    const details = projectDetailsInput ? projectDetailsInput.value.trim() : '';

    const lines = [
      'Olá, equipe T&J Trabalhos Acadêmicos! Tudo bem?',
      'Gostaria de solicitar um orçamento para meu projeto:'
    ];

    if (name) lines.push(`• *Nome:* ${name}`);
    if (course) lines.push(`• *Curso/Área:* ${course}`);
    if (service) lines.push(`• *Demanda:* ${service}`);
    if (norm) lines.push(`• *Norma/Diretriz:* ${norm}`);
    if (stage) lines.push(`• *Etapa atual:* ${stage}`);
    if (deadline) lines.push(`• *Prazo estimado:* ${deadline}`);
    if (details) lines.push(`• *Observações/Tema:* ${details}`);

    return lines.join('\n');
  }

  function updatePreview() {
    if (!liveMessagePreview) return;
    liveMessagePreview.textContent = buildWhatsAppMessage();
  }

  [
    studentNameInput,
    courseAreaInput,
    serviceTypeSelect,
    normStandardSelect,
    projectStageSelect,
    deadlineInfoInput,
    projectDetailsInput
  ].forEach((input) => {
    if (!input) return;
    input.addEventListener('input', updatePreview);
    input.addEventListener('change', updatePreview);
  });

  updatePreview();

  if (copySummaryBtn) {
    copySummaryBtn.addEventListener('click', () => {
      copyTextToClipboard(buildWhatsAppMessage(), () => {
        const original = copySummaryBtn.textContent;
        copySummaryBtn.textContent = 'Resumo copiado! ✓';
        setTimeout(() => {
          copySummaryBtn.textContent = original;
        }, 2200);
      });
    });
  }

  // Validação acessível e envio via WhatsApp
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
        if (errorCourse) errorCourse.textContent = 'Informe seu curso ou área acadêmica.';
        isValid = false;
        firstInvalid = firstInvalid || courseAreaInput;
      } else if (courseAreaInput) {
        courseAreaInput.setAttribute('aria-invalid', 'false');
        if (errorCourse) errorCourse.textContent = '';
      }

      if (serviceTypeSelect && !serviceTypeSelect.value) {
        serviceTypeSelect.setAttribute('aria-invalid', 'true');
        if (errorService) errorService.textContent = 'Selecione o tipo de demanda acadêmica.';
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
