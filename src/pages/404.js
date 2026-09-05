export function render404() {
  document.getElementById('page-content').innerHTML = `
    <div class="error-page">
      <div class="error-code">404</div>
      <h1>পেজটি খুঁজে পাওয়া যায়নি</h1>
      <p>আপনি যে পেজটি খুঁজছেন সেটি সরানো হয়েছে বা কখনো ছিল না।</p>
      <a href="/" class="btn btn-primary">হোমে ফিরুন</a>
    </div>`;
}
