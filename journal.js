// Global Interactive Features for Journal Articles (Immediate Top-Level Delegation)
(function () {
  if (window.__journal_js_initialized) return;
  window.__journal_js_initialized = true;

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