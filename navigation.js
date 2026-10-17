export function initNavigation() {
  const cleanups = [];
  function listen(target, event, callback) {
    target.addEventListener(event, callback);
    cleanups.push(() => target.removeEventListener(event, callback));
  }
  const logoButton = document.querySelector('.logo-toggle');
  listen(logoButton, 'click', () => {
    const dark = logoButton.getAttribute('aria-pressed') !== 'true';
    logoButton.setAttribute('aria-pressed', String(dark));
  });

  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.menu-overlay');
  const mobileViewport = window.matchMedia('(max-width: 720px)');

  function setMenuOpen(open, restoreFocus = true) {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
    overlay.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    document.querySelectorAll('.hero, .stats, .logo, .product-view').forEach(element => { element.inert = open; });
    if (!open && restoreFocus) menuButton.focus();
  }

  listen(menuButton, 'click', () => {
    setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true');
  });
  listen(overlay, 'click', () => setMenuOpen(false));
  listen(menu, 'click', event => {
    if (event.target.closest('a, [data-contact-trigger]')) setMenuOpen(false, false);
  });
  listen(document, 'keydown', event => {
    if (menu.hidden) return;
    if (event.key === 'Escape') setMenuOpen(false);
    if (event.key === 'Tab') {
      const lastLink = menu.lastElementChild;
      if (event.shiftKey && document.activeElement === menuButton) {
        event.preventDefault();
        lastLink.focus();
      } else if (!event.shiftKey && document.activeElement === lastLink) {
        event.preventDefault();
        menuButton.focus();
      }
    }
  });
  listen(mobileViewport, 'change', event => {
    if (!event.matches) setMenuOpen(false, false);
  });

  listen(window, 'popstate', () => setMenuOpen(false, false));
  return () => { cleanups.forEach(cleanup => cleanup()); setMenuOpen(false, false); };
}
