// Pure Interactive Features for Journal Articles (Copy Code & Smooth Anchor Jumps)
(function () {
  function attachJournalEventListeners(rootDoc) {
    const doc = rootDoc || document;
    if (doc.__article_click_listener_attached) return;
    doc.__article_click_listener_attached = true;

    doc.addEventListener('click', function (e) {
      // 1. Copy Code Button Handler
      const copyBtn = e.target.closest('.article-code-copy-btn, .code-copy-btn');
      if (copyBtn) {
        e.preventDefault();
        e.stopPropagation();

        const wrapper = copyBtn.closest('.article-code-block-wrapper, .code-block-wrapper');
        if (wrapper) {
          const codeEl = wrapper.querySelector('pre code');
          if (codeEl) {
            const codeText = codeEl.innerText || codeEl.textContent || '';
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(codeText).then(function () {
                showCopySuccess(copyBtn);
              }).catch(function () {
                fallbackCopyText(codeText, copyBtn);
              });
            } else {
              fallbackCopyText(codeText, copyBtn);
            }
          }
        }
        return;
      }

      // 2. Universal Anchor & Footnote Jump Click Listener
      const anchor = e.target.closest('a[href^="#"]');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;

        e.preventDefault();
        e.stopPropagation();

        const targetId = href.substring(1);
        const root = anchor.getRootNode() || doc;
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
          targetEl = doc.getElementById(targetId);
        }

        if (targetEl) {
          const rect = targetEl.getBoundingClientRect();
          const currentScrollTop = window.pageYOffset || doc.documentElement.scrollTop || doc.body.scrollTop || 0;
          const targetScrollTop = currentScrollTop + rect.top - 80;

          window.scrollTo({
            top: Math.max(0, targetScrollTop),
            behavior: 'smooth'
          });

          try {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } catch (_) {}

          targetEl.classList.add('journal-footnote-highlight');
          setTimeout(function () {
            targetEl.classList.remove('journal-footnote-highlight');
          }, 2500);
        }
      }
    }, true);
  }

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

  // Initialize on main document and window load
  attachJournalEventListeners(document);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      attachJournalEventListeners(document);
    });
  }
})();