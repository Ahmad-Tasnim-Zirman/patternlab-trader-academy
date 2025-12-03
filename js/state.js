(function () {
  const STORAGE_KEY = "patternlab:userState:v1";

  const defaultState = {
    username: "Guest trader",
    currentTier: "beginner",
    xp: 120,
    xpToNext: 200,
    level: 3,
    streak: 4,
    bestStreak: 9
  };

  let state = null;

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...defaultState };
      const parsed = JSON.parse(raw);
      return { ...defaultState, ...parsed };
    } catch (_) {
      return { ...defaultState };
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {
      // ignore
    }
  }

  window.PatternLab = window.PatternLab || {};

  window.PatternLab.state = {
    init() {
      state = loadState();
    },
    get() {
      return state;
    },
    update(patch) {
      state = { ...state, ...patch };
      saveState();
    }
  };
})();
