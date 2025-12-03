// Progression engine: XP, levels, daily streak, module/lesson unlocks.

(function () {
  const LEVEL_XP = 200; // constant XP per level for V1

  function todayISO() {
    return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  }

  // Streak rules:
  // - Streak is per-day, not per-task.
  // - If user completed >=1 task on a day, then:
  //     next time the date changes, streak += 1.
  // - If user completed 0 tasks on a day, next time the user is active,
  //     streak resets to 0.
  // - Completing/failing tasks never directly changes streak.
  function rollOverIfNeeded() {
    const s = PatternLab.state.get();
    const today = todayISO();

    // First ever run: just set date, do not change streak.
    if (!s.lastActiveDate) {
      PatternLab.state.update({
        lastActiveDate: today,
        tasksCompletedToday: s.tasksCompletedToday || 0,
        streak: s.streak || 0,
        bestStreak: s.bestStreak || 0
      });
      return;
    }

    if (s.lastActiveDate === today) {
      // Same calendar day, nothing to do.
      return;
    }

    // Date has advanced: evaluate yesterday.
    let newStreak;
    if ((s.tasksCompletedToday || 0) >= 1) {
      newStreak = (s.streak || 0) + 1;
    } else {
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

  // Public API for a task being completed (quiz, lesson, pattern task, etc.).
  // success: boolean (passed / failed)
  // xpFull: XP when success = true
  // xpPartial: XP when success = false
  //
  // Streak:
  // - Any completed task counts towards "tasksCompletedToday" (success or not).
  // - Streak is handled only by date rollover (see rollOverIfNeeded).
  function registerTaskResult(opts) {
    const options = opts || {};
    const success = !!options.success;
    const xpFull = Number.isFinite(options.xpFull) ? options.xpFull : 50;
    const xpPartial = Number.isFinite(options.xpPartial) ? options.xpPartial : 20;

    // Apply potential date rollover first.
    rollOverIfNeeded();

    const xpGain = success ? xpFull : xpPartial;
    if (xpGain > 0) {
      addXP(xpGain);
    }

    // Count this as a completed task for the day (regardless of success).
    const s = PatternLab.state.get();
    const newCount = (s.tasksCompletedToday || 0) + 1;

    PatternLab.state.update({
      tasksCompletedToday: newCount
    });
  }

  // Module unlock check, based on static structure definition.
  // structure.modules: {
  //   moduleId: { requiredLevel?: number, requiredModules?: string[] }
  // }
  // structure.progress: { [moduleId]: boolean } // optional external structure
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

  // Mark a single lesson finished inside a module.
  function completeLesson(moduleId, lessonId) {
    const store = PatternLab.state.get();
    const progress = store.lessonProgress || {};
    if (!progress[moduleId]) progress[moduleId] = {};
    progress[moduleId][lessonId] = true;

    PatternLab.state.update({ lessonProgress: progress });
  }

  // Should be called once on app open to apply daily rollover without
  // requiring a task completion.
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
