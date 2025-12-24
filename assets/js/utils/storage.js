// storage.js — simple localStorage wrapper

export const storage = {
  get(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // fail silently
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      // fail silently
    }
  }
};
