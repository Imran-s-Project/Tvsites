/**
 * Auth Component
 * Google Sign-In + Email/Password
 * Protected route guard
 */
export const Auth = {

  async requireAuth(redirectTo = '/auth') {
    return new Promise(resolve => {
      const { onAuthStateChanged } = window.__firebaseModules || {};
      const unsubscribe = window.__firebase.auth.onAuthStateChanged
        ? window.__firebase.auth
        : null;

      if (window.__user !== undefined) {
        if (!window.__user) window.App.navigate(redirectTo);
        else resolve(window.__user);
        return;
      }

      // Wait for auth to settle
      const unsub = setInterval(() => {
        if (window.__user !== undefined) {
          clearInterval(unsub);
          if (!window.__user) window.App.navigate(redirectTo);
          else resolve(window.__user);
        }
      }, 100);
    });
  },

  async signInWithGoogle() {
    const { GoogleAuthProvider, signInWithPopup } =
      await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    return signInWithPopup(window.__firebase.auth, provider);
  },

  async signInWithEmail(email, password) {
    const { signInWithEmailAndPassword } =
      await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
    return signInWithEmailAndPassword(window.__firebase.auth, email, password);
  },

  async registerWithEmail(email, password, displayName) {
    const { createUserWithEmailAndPassword, updateProfile } =
      await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
    const cred = await createUserWithEmailAndPassword(window.__firebase.auth, email, password);
    if (displayName) await updateProfile(cred.user, { displayName });
    return cred;
  },

  async resetPassword(email) {
    const { sendPasswordResetEmail } =
      await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
    return sendPasswordResetEmail(window.__firebase.auth, email);
  }
};
