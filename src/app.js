/**
 * Tech Verse — Main App
 * Router, Auth listener, Theme, Service Worker
 */

import { Navbar }  from './components/navbar.js';
import { Footer }  from './components/footer.js';
import { Search }  from './components/search.js';
import { Toast }   from './components/toast.js';
import { Auth }    from './components/auth.js';

// ─── Route Map ─────────────────────────────────────────────
const ROUTES = {
  '/'         : () => import('./pages/home.js').then(m => m.renderHome()),
  '/blog'     : () => import('./pages/blog.js').then(m => m.renderBlog()),
  '/blog/:id' : () => import('./pages/post.js').then(m => m.renderPost()),
  '/auth'     : () => import('./pages/auth.js').then(m => m.renderAuth()),
  '/profile'  : () => import('./pages/profile.js').then(m => m.renderProfile()),
  '/404'      : () => import('./pages/404.js').then(m => m.render404()),
};

// ─── App Object ────────────────────────────────────────────
export const App = {

  async init() {
    this._applyTheme();
    this._initServiceWorker();

    // Render shell components
    Navbar.render();
    Footer.render();
    Search.init();
    Toast.init();

    // Auth state listener
    const { onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
    onAuthStateChanged(window.__firebase.auth, user => {
      window.__user = user || null;
      Navbar.updateAuthState(user);
    });

    // Router setup
    this._route();
    window.addEventListener('popstate', () => this._route());

    // Intercept all internal links
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (href.startsWith('/') && !href.startsWith('//')) {
        e.preventDefault();
        this.navigate(href);
      }
    });
  },

  navigate(path) {
    window.history.pushState({}, '', path);
    this._route();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  async _route() {
    const path    = window.location.pathname;
    const content = document.getElementById('page-content');
    content.innerHTML = '<div class="page-loader"><span class="loader-ring"></span></div>';

    // Match exact or parameterized route
    let handler = ROUTES[path];
    let params  = {};

    if (!handler) {
      // Try param routes e.g. /blog/:id
      for (const [pattern, fn] of Object.entries(ROUTES)) {
        const match = this._matchRoute(pattern, path);
        if (match) { handler = fn; params = match; break; }
      }
    }

    // Store current params globally
    window.__routeParams = params;

    try {
      if (handler) {
        await handler();
      } else {
        await ROUTES['/404']();
      }
    } catch (err) {
      console.error('[Router]', err);
      content.innerHTML = `<div class="error-state">
        <h2>কিছু একটা ভুল হয়েছে</h2>
        <p>${err.message}</p>
        <button onclick="App.navigate('/')">হোমে ফিরুন</button>
      </div>`;
    }
  },

  _matchRoute(pattern, path) {
    const patternParts = pattern.split('/');
    const pathParts    = path.split('/');
    if (patternParts.length !== pathParts.length) return null;
    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].slice(1)] = pathParts[i];
      } else if (patternParts[i] !== pathParts[i]) {
        return null;
      }
    }
    return params;
  },

  _applyTheme() {
    const saved = localStorage.getItem('tv-theme') || 'light';
    document.documentElement.dataset.theme = saved;
  },

  _initServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }
};

// Make App & Toast global for inline onclick use
window.App   = App;
window.Toast = Toast;
