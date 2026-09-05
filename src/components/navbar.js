/**
 * Navbar Component
 * Sticky, responsive, dark-mode toggle, auth-aware
 */
export const Navbar = {

  render() {
    document.getElementById('navbar').innerHTML = `
      <div class="nav-inner">
        <a href="/" class="nav-logo" aria-label="Tech Verse হোমে যান">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <rect width="28" height="28" rx="8" fill="url(#lg)"/>
            <path d="M8 14h12M14 8l6 6-6 6" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <defs>
              <linearGradient id="lg" x1="0" y1="0" x2="28" y2="28">
                <stop stop-color="#6366f1"/>
                <stop offset="1" stop-color="#8b5cf6"/>
              </linearGradient>
            </defs>
          </svg>
          <span>Tech <strong>Verse</strong></span>
        </a>

        <div class="nav-links" id="nav-links">
          <a href="/"      class="nav-link">হোম</a>
          <a href="/blog"  class="nav-link">ব্লগ</a>
          <a href="/tools" class="nav-link">টুলস</a>
          <a href="/learn" class="nav-link">লার্নিং</a>
        </div>

        <div class="nav-actions">
          <button class="nav-btn icon-btn" id="search-btn" onclick="window.Search.open()" aria-label="সার্চ খুলুন">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>

          <button class="nav-btn icon-btn" id="theme-btn" onclick="Navbar.toggleTheme()" aria-label="থিম পরিবর্তন">
            <svg class="icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <svg class="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>

          <div id="auth-area" class="auth-area">
            <a href="/auth" class="nav-btn btn-primary">লগইন</a>
          </div>

          <button class="nav-btn icon-btn hamburger" id="hamburger" aria-label="মেনু" onclick="Navbar.toggleMenu()">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    `;

    this._markActive();
    this._stickyOnScroll();
  },

  updateAuthState(user) {
    const area = document.getElementById('auth-area');
    if (!area) return;
    if (user) {
      const initials = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
      area.innerHTML = `
        <div class="user-menu">
          <button class="avatar-btn" onclick="Navbar.toggleUserMenu()" aria-label="ইউজার মেনু">
            ${user.photoURL
              ? `<img src="${user.photoURL}" alt="${user.displayName}" class="avatar-img"/>`
              : `<span class="avatar-initials">${initials}</span>`}
          </button>
          <div class="user-dropdown" id="user-dropdown" hidden>
            <div class="user-info">
              <strong>${user.displayName || 'ব্যবহারকারী'}</strong>
              <span>${user.email}</span>
            </div>
            <hr/>
            <a href="/profile">প্রোফাইল</a>
            <button onclick="Navbar.signOut()">সাইন আউট</button>
          </div>
        </div>`;
    } else {
      area.innerHTML = `<a href="/auth" class="nav-btn btn-primary">লগইন</a>`;
    }
  },

  toggleTheme() {
    const root  = document.documentElement;
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = theme;
    localStorage.setItem('tv-theme', theme);
  },

  toggleMenu() {
    const links = document.getElementById('nav-links');
    const btn   = document.getElementById('hamburger');
    links.classList.toggle('open');
    btn.classList.toggle('open');
  },

  toggleUserMenu() {
    const dd = document.getElementById('user-dropdown');
    if (dd) dd.hidden = !dd.hidden;
  },

  async signOut() {
    const { signOut } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
    await signOut(window.__firebase.auth);
    window.Toast.show('সাইন আউট সফল হয়েছে', 'success');
    window.App.navigate('/');
  },

  _markActive() {
    const path  = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === path);
    });
  },

  _stickyOnScroll() {
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }
};

window.Navbar = Navbar;
