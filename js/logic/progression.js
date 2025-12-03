// Progression engine: XP, levels, daily streak, module/lesson unlocks.

(function () {
  const LEVEL_XP = 200; // constant XP per level for V1

  function todayISO() {
    return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  }

  // Daily rollover:
  // - Only responsibility: detect missed days and reset streak if needed.
  // - No increment happens here; increment is on first task of the day.
  function rollOverIfNeeded() {
    const s = PatternLab.state.get();
    const today = todayISO();

    // First ever run
    if (!s.lastActiveDate) {
      PatternLab.state.update({
        lastActiveDate: today,
        tasksCompletedToday: s.tasksCompletedToday || 0,
        streak: s.streak || 0,
        bestStreak: s.bestStreak || 0
      });
      return;
    }

    // Same calendar day, nothing to do
    if (s.lastActiveDate === today) {
      return;
    }

    // New day:
    // If yesterday had 0 tasks, streak is broken.
    let newStreak = s.streak || 0;
    if ((s.tasksCompletedToday || 0) === 0) {
      newStreak = 0;
    }

    const best = Math.max(s.bestStreak || 0, newStreak);

    PatternLab.state.update({
      lastActiveDate: today,
      tasksCompletedToday: 0,
      streak: newStreak,
      bestStreak: best
    });
  }

  function addXP(amount) {
    const s = PatternLab.state.get();
    let xp = (s.xp || 0) + amount;
    let level = s.level || 1;
    let leftover = xp;

    while (leftover >= LEVEL_XP) {
      leftover -= LEVEL_XP;
      level += 1;
    }

    PatternLab.state.update({
      xp: leftover,
      level: level,
      xpToNext: LEVEL_XP
    });
  }

  // Register a task (quiz, lesson, pattern task, etc.).
  // success: boolean
  // xpFull, xpPartial: numbers
  //
  // - Any task (success or fail) counts for the daily streak.
  // - First task of a given day increments streak by +1.
  function registerTaskResult(opts) {
    const options = opts || {};
    const success = !!options.success;
    const xpFull = Number.isFinite(options.xpFull) ? options.xpFull : 50;
    const xpPartial = Number.isFinite(options.xpPartial) ? options.xpPartial : 20;

    // 1) Handle day change / streak break
    rollOverIfNeeded();

    // 2) Snapshot after rollover
    const before = PatternLab.state.get();
    const firstTaskToday = (before.tasksCompletedToday || 0) === 0;

    // 3) XP
    const xpGain = success ? xpFull : xpPartial;
    if (xpGain > 0) addXP(xpGain);

    // 4) Update daily counters + streak increment on first task
    const afterXP = PatternLab.state.get();
    const newTasksToday = (afterXP.tasksCompletedToday || 0) + 1;
    const baseStreak = afterXP.streak || 0;
    const newStreak = baseStreak + (firstTaskToday ? 1 : 0);
    const best = Math.max(afterXP.bestStreak || 0, newStreak);

    PatternLab.state.update({
      tasksCompletedToday: newTasksToday,
      streak: newStreak,
      bestStreak: best
    });
  }

  function isModuleUnlocked(moduleId, structure) {
    const s = PatternLab.state.get();
    const meta = structure.modules[moduleId];
    if (!meta) return false;

    if (meta.requiredLevel && s.level < meta.requiredLevel) return false;

    if (meta.requiredModules) {
      const completedModules = structure.progress || {};
      for (let m of meta.requiredModules) {
        if (!completedModules[m]) return false;
      }
    }

    return true;
  }

  function completeLesson(moduleId, lessonId) {
    const store = PatternLab.state.get();
    const progress = store.lessonProgress || {};
    if (!progress[moduleId]) progress[moduleId] = {};
    progress[moduleId][lessonId] = true;

    PatternLab.state.update({ lessonProgress: progress });
  }

  // Should be called once on app open
  function onAppOpen() {
    rollOverIfNeeded();
  }

  window.PatternLab = window.PatternLab || {};
  window.PatternLab.progression = {
    onAppOpen,
    registerTaskResult,
    addXP,
    isModuleUnlocked,
    completeLesson
  };
})();
