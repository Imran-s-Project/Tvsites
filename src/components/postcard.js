/**
 * PostCard — Reusable card for blog posts
 */
export const PostCard = {
  render(post) {
    const date = post.createdAt?.toDate
      ? post.createdAt.toDate().toLocaleDateString('bn-BD', { year:'numeric', month:'long', day:'numeric' })
      : '—';
    return `
      <article class="post-card">
        ${post.cover
          ? `<a href="/blog/${post.id}" class="post-cover">
               <img src="${post.cover}" alt="${post.title}" loading="lazy"/>
             </a>`
          : `<a href="/blog/${post.id}" class="post-cover post-cover-placeholder" aria-hidden="true">
               <span>${post.category?.[0] || 'T'}</span>
             </a>`}
        <div class="post-body">
          ${post.category ? `<span class="post-category">${post.category}</span>` : ''}
          <h3 class="post-title"><a href="/blog/${post.id}">${post.title}</a></h3>
          <p class="post-excerpt">${post.excerpt || ''}</p>
          <div class="post-meta">
            <span class="post-date">${date}</span>
            ${post.readTime ? `<span class="post-read">${post.readTime} পড়া</span>` : ''}
          </div>
        </div>
      </article>`;
  },

  skeleton() {
    return `
      <article class="post-card skeleton-card" aria-hidden="true">
        <div class="post-cover sk-block"></div>
        <div class="post-body">
          <div class="sk-line sk-short"></div>
          <div class="sk-line sk-full"></div>
          <div class="sk-line sk-mid"></div>
        </div>
      </article>`;
  }
};
