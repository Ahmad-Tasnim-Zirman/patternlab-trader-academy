(function () {
    const STORAGE_KEY = "patternlab:userState:v1";

    const defaultState = {
        username: null,
        currentTier: "beginner",
        xp: 0,
        level: 1,
        streak: 0,
        bestStreak: 0,
        progressionMode: {
            beginner: "linear",
            intermediate: "linear",
            expert: "linear"
        },
        unlockedModules: [],
        completedLessons: [],
        completedQuizzes: []
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
        } catch (_) {}
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
        },
        reset() {
            state = { ...defaultState };
        saveState();
        }
    };
})();
