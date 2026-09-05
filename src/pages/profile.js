/**
 * Profile Page — Protected, shows user info + bookmarks
 */
import { Auth } from '../components/auth.js';

export async function renderProfile() {
  const user = await Auth.requireAuth('/auth');
  const el   = document.getElementById('page-content');

  el.innerHTML = `
    <div class="container profile-page">
      <div class="profile-card">
        <div class="profile-avatar">
          ${user.photoURL
            ? `<img src="${user.photoURL}" alt="${user.displayName}"/>`
            : `<div class="avatar-lg">${(user.displayName||user.email||'U')[0].toUpperCase()}</div>`}
        </div>
        <div class="profile-info">
          <h1>${user.displayName || 'ব্যবহারকারী'}</h1>
          <p class="profile-email">${user.email}</p>
          <p class="profile-joined">যোগ দিয়েছেন: ${
            new Date(user.metadata.creationTime).toLocaleDateString('bn-BD',{year:'numeric',month:'long',day:'numeric'})
          }</p>
        </div>
      </div>

      <div class="profile-sections">
        <div class="profile-section">
          <h2>আমার বুকমার্ক</h2>
          <div id="bookmarks-list" class="posts-grid">
            <p class="empty-state">কোনো বুকমার্ক নেই। ব্লগ পড়ুন এবং সেভ করুন।</p>
          </div>
        </div>
      </div>
    </div>
  `;

  _loadBookmarks(user.uid);
}

async function _loadBookmarks(uid) {
  try {
    const { collection, query, where, getDocs } =
      await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
    const { PostCard } = await import('../components/postcard.js');
    const snap = await getDocs(
      query(collection(window.__firebase.db, 'bookmarks'), where('uid', '==', uid))
    );
    const container = document.getElementById('bookmarks-list');
    if (snap.empty) return;
    container.innerHTML = snap.docs.map(d => PostCard.render(d.data().post)).join('');
  } catch { /* silent */ }
}
