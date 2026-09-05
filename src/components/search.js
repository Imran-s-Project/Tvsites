/**
 * Search Component
 * Ctrl+K shortcut, Fuse.js fuzzy search, Firestore data
 */
let fuse     = null;
let allPosts = [];

export const Search = {

  async init() {
    // Keyboard shortcut
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.open();
      }
      if (e.key === 'Escape') this.close();
    });

    const input = document.getElementById('search-input');
    input.addEventListener('input', () => this._onInput(input.value));

    // Click outside to close
    document.getElementById('search-overlay').addEventListener('click', e => {
      if (e.target.id === 'search-overlay') this.close();
    });

    // Load data for search
    await this._loadData();
  },

  async _loadData() {
    try {
      const { collection, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
      const snap = await getDocs(collection(window.__firebase.db, 'posts'));
      allPosts = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      const Fuse = (await import('https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.esm.js')).default;
      fuse = new Fuse(allPosts, {
        keys: [
          { name: 'title',   weight: 0.6 },
          { name: 'excerpt', weight: 0.3 },
          { name: 'tags',    weight: 0.1 },
        ],
        threshold:       0.4,
        includeMatches:  true,
        minMatchCharLen: 2,
      });
    } catch (err) {
      console.warn('[Search] Firestore unavailable, using demo data');
      allPosts = DEMO_POSTS;
      const Fuse = (await import('https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.esm.js')).default;
      fuse = new Fuse(allPosts, { keys: ['title','excerpt','tags'], threshold: 0.4 });
    }
  },

  open() {
    const overlay = document.getElementById('search-overlay');
    overlay.classList.add('active');
    overlay.removeAttribute('aria-hidden');
    setTimeout(() => document.getElementById('search-input').focus(), 50);
  },

  close() {
    const overlay = document.getElementById('search-overlay');
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.getElementById('search-input').value = '';
    document.getElementById('search-results').innerHTML = '';
  },

  _onInput(query) {
    const container = document.getElementById('search-results');
    if (!query.trim()) { container.innerHTML = ''; return; }
    if (!fuse) { container.innerHTML = '<p class="search-msg">লোড হচ্ছে...</p>'; return; }

    const results = fuse.search(query).slice(0, 6);
    if (!results.length) {
      container.innerHTML = `<p class="search-msg">"${query}" এর জন্য কোনো ফলাফল নেই।</p>`;
      return;
    }

    container.innerHTML = results.map(({ item }) => `
      <a class="search-item" href="/blog/${item.id}" onclick="window.Search.close()">
        <div class="si-category">${item.category || 'সাধারণ'}</div>
        <div class="si-title">${item.title}</div>
        <div class="si-excerpt">${item.excerpt || ''}</div>
      </a>
    `).join('');
  }
};

// Demo posts for when Firebase isn't configured yet
const DEMO_POSTS = [
  { id: '1', title: 'JavaScript ES2024 নতুন ফিচার',    excerpt: 'নতুন ভার্সনে কী কী এলো', category: 'JavaScript', tags: ['js','es2024'] },
  { id: '2', title: 'Firebase Firestore সম্পূর্ণ গাইড', excerpt: 'রিয়েল-টাইম ডেটাবেস ব্যবহার', category: 'Firebase',    tags: ['firebase','db'] },
  { id: '3', title: 'PWA তৈরির সহজ পদ্ধতি',            excerpt: 'Service Worker ও Manifest', category: 'PWA',        tags: ['pwa','mobile'] },
  { id: '4', title: 'CSS Grid দিয়ে স্মার্ট লেআউট',     excerpt: 'আধুনিক লেআউট তৈরির কৌশল',  category: 'CSS',        tags: ['css','layout'] },
];

window.Search = Search;
