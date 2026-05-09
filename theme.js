// Maluti Primary School - Shared Theme System
// Dark/Light mode + shared utilities

(function() {
  const THEME_KEY = 'maluti_theme';
  const SESSION_KEY = 'maluti_session';

  // ─── Theme ───────────────────────────────────────────────────────────────
  window.MalutiTheme = {
    init() {
      const saved = localStorage.getItem(THEME_KEY) || 'dark';
      this.apply(saved);
    },
    toggle() {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      this.apply(next);
    },
    apply(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(THEME_KEY, theme);
      const btn = document.getElementById('theme-toggle');
      if (btn) btn.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
    }
  };

  // ─── Session ─────────────────────────────────────────────────────────────
  window.MalutiSession = {
    save(user) { sessionStorage.setItem(SESSION_KEY, JSON.stringify(user)); },
    get() {
      try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); }
      catch { return null; }
    },
    clear() { sessionStorage.removeItem(SESSION_KEY); },
    require(expectedRole) {
      const u = this.get();
      if (!u) { window.location.href = 'index.html'; return null; }
      if (expectedRole && u.role !== expectedRole) { window.location.href = 'index.html'; return null; }
      return u;
    }
  };

  // ─── Toast notifications ──────────────────────────────────────────────────
  window.MalutiToast = {
    show(msg, type = 'info') {
      let container = document.getElementById('toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:10px;';
        document.body.appendChild(container);
      }
      const toast = document.createElement('div');
      const colors = { success: '#22c55e', error: '#ef4444', info: '#3b82f6', warning: '#f59e0b' };
      toast.style.cssText = `background:${colors[type]||colors.info};color:#fff;padding:12px 20px;border-radius:10px;font-family:'Sora',sans-serif;font-size:14px;font-weight:600;box-shadow:0 4px 20px rgba(0,0,0,0.3);opacity:0;transform:translateX(40px);transition:all 0.3s ease;max-width:300px;`;
      toast.textContent = msg;
      container.appendChild(toast);
      requestAnimationFrame(() => { toast.style.opacity = '1'; toast.style.transform = 'translateX(0)'; });
      setTimeout(() => {
        toast.style.opacity = '0'; toast.style.transform = 'translateX(40px)';
        setTimeout(() => toast.remove(), 300);
      }, 3500);
    }
  };

  // ─── In-memory data store (simulates DB) ─────────────────────────────────
  window.MalutiDB = {
    _key: 'maluti_db',
    _defaults: {
      students: [
        { id: 2, name: 'John Doe', class: 'Class 1', age: 10 },
        { id: 3, name: 'Tsolo Mokoena', class: 'Class 2', age: 9 }
      ],
      teachers: [
        { id: 2, name: 'Tanki Molapo', subject: 'Maths', class: 'Class 5' },
        { id: 3, name: 'Lerato Sithole', subject: 'English', class: 'Class 3' }
      ],
      attendance: [
        { id: 1, student_name: 'John Doe', status: 'Present', date: '2025-05-05' },
        { id: 2, student_name: 'John Doe', status: 'Absent', date: '2025-05-06' },
        { id: 3, student_name: 'Tsolo Mokoena', status: 'Present', date: '2025-05-05' }
      ],
      grades: [
        { id: 1, student_name: 'John Doe', subject: 'English', grade: 100 },
        { id: 2, student_name: 'John Doe', subject: 'Math', grade: 90 },
        { id: 3, student_name: 'John Doe', subject: 'Science', grade: 40 },
        { id: 4, student_name: 'John Doe', subject: 'History', grade: 60 },
        { id: 5, student_name: 'John Doe', subject: 'Computer', grade: 70 },
        { id: 6, student_name: 'Tsolo Mokoena', subject: 'English', grade: 75 },
        { id: 7, student_name: 'Tsolo Mokoena', subject: 'Math', grade: 82 }
      ],
      fees: [
        { id: 1, student_id: 2, student_name: 'John Doe', amount: 500, status: 'Paid', date: '2025-05-01' },
        { id: 2, student_id: 3, student_name: 'Tsolo Mokoena', amount: 500, status: 'Pending', date: '2025-05-05' }
      ],
      nextId: { students: 10, teachers: 10, attendance: 10, grades: 10, fees: 10 }
    },
    load() {
      try {
        const raw = localStorage.getItem(this._key);
        return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(this._defaults));
      } catch { return JSON.parse(JSON.stringify(this._defaults)); }
    },
    save(data) { localStorage.setItem(this._key, JSON.stringify(data)); },
    get() { return this.load(); },
    set(data) { this.save(data); }
  };

})();
