// Global Interactive Features & Bootstrap JS Bundle for Journal Articles
(function () {
  if (window.__journal_js_initialized) return;
  window.__journal_js_initialized = true;

  // 1. Dynamically ensure Bootstrap 5 JS Bundle is loaded for Interactive Widgets (Tabs, Accordions, Tooltips)
  if (!window.bootstrap && !document.querySelector('script[src*="bootstrap.bundle"]')) {
    const bsScript = document.createElement('script');
    bsScript.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js';
    bsScript.defer = true;
    bsScript.onload = function () {
      initBootstrapWidgets();
    };
    document.head.appendChild(bsScript);
  } else if (window.bootstrap) {
    initBootstrapWidgets();
  }

  function initBootstrapWidgets() {
    try {
      // Auto-initialize Tooltips if present
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new window.bootstrap.Tooltip(tooltipTriggerEl);
      });

      // Auto-initialize Popovers if present
      const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
      popoverTriggerList.map(function (popoverTriggerEl) {
        return new window.bootstrap.Popover(popoverTriggerEl);
      });
    } catch (_) {}
  }

  // 2. Global Event Listener for Copy Code Buttons
  document.addEventListener('click', function (e) {
    const copyBtn = e.target.closest('.code-copy-btn');
    if (!copyBtn) return;

    e.preventDefault();
    e.stopPropagation();

    const wrapper = copyBtn.closest('.code-block-wrapper');
    if (!wrapper) return;

    const codeEl = wrapper.querySelector('pre code');
    if (!codeEl) return;

    const codeText = codeEl.innerText || codeEl.textContent || '';

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(codeText).then(function () {
        showCopySuccess(copyBtn);
      }).catch(function (err) {
        fallbackCopyText(codeText, copyBtn);
      });
    } else {
      fallbackCopyText(codeText, copyBtn);
    }
  });

  // 3. Universal Anchor & Footnote Jump Click Listener (Clean URL, Smooth Scroll & Pulse Highlight)
  document.addEventListener('click', function (e) {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;

    // Prevent URL bar from appending #hash parameters
    e.preventDefault();
    e.stopPropagation();

    const targetId = href.substring(1);
    const root = anchor.getRootNode() || document;
    let targetEl = null;

    if (root.getElementById) {
      targetEl = root.getElementById(targetId);
    }
    if (!targetEl && root.querySelector) {
      try {
        targetEl = root.querySelector('#' + CSS.escape(targetId));
      } catch (_) {}
    }
    if (!targetEl) {
      targetEl = document.getElementById(targetId);
    }

    if (targetEl) {
      // Calculate scroll position with sticky header offset (80px)
      const rect = targetEl.getBoundingClientRect();
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const targetScrollTop = currentScrollTop + rect.top - 80;

      window.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: 'smooth'
      });

      try {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch (_) {}

      // Add visual pulse glow
      targetEl.classList.add('footnote-highlight');
      setTimeout(function () {
        targetEl.classList.remove('footnote-highlight');
      }, 2500);
    }
  });

  function showCopySuccess(btn) {
    const originalText = btn.getAttribute('data-original-text') || btn.innerText || 'Copy';
    btn.setAttribute('data-original-text', originalText);
    btn.innerText = 'Copied!';
    btn.classList.add('copied');

    setTimeout(function () {
      btn.innerText = originalText;
      btn.classList.remove('copied');
    }, 2000);
  }

  function fallbackCopyText(text, btn) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '0';
    textarea.style.width = '2em';
    textarea.style.height = '2em';
    textarea.style.padding = '0';
    textarea.style.border = 'none';
    textarea.style.outline = 'none';
    textarea.style.boxShadow = 'none';
    textarea.style.background = 'transparent';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand('copy');
      showCopySuccess(btn);
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
    document.body.removeChild(textarea);
  }
})();