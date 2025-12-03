(function () {
  window.PatternLab = window.PatternLab || {};

  function computeModuleProgress(structure, state) {
    const progress = {};
    const lessonProgress = (state && state.lessonProgress) || {};

    Object.keys(structure.modules).forEach(function (moduleId) {
      const lessons = structure.lessons[moduleId] || [];
      if (!lessons.length) return;

      const moduleLessonProgress = lessonProgress[moduleId] || {};
      const allDone = lessons.every(function (lesson) {
        return !!moduleLessonProgress[lesson.id];
      });

      if (allDone) {
        progress[moduleId] = true;
      }
    });

    return progress;
  }

  window.PatternLab.dashboard = {
    render() {
      const s = PatternLab.state.get();
      const structure = PatternLab.structure;

      const moduleProgress = computeModuleProgress(structure, s);

      const structureForUnlock = Object.assign({}, structure, {
        progress: moduleProgress
      });

      let unlockedB2 = false;
      let unlockedB3 = false;

      if (structureForUnlock && PatternLab.progression) {
        unlockedB2 = PatternLab.progression.isModuleUnlocked("B2", structureForUnlock);
        unlockedB3 = PatternLab.progression.isModuleUnlocked("B3", structureForUnlock);
      }

      const b1Meta = moduleProgress.B1
        ? "Completed · all lessons done"
        : "In progress · clear all four steps";

      const b2Meta = unlockedB2
        ? (moduleProgress.B2
            ? "Completed · module done"
            : "Unlocked · ready when you are")
        : "Locked · level 4 and B1 required";

      const b3Meta = unlockedB3
        ? (moduleProgress.B3
            ? "Completed · module done"
            : "Unlocked · B1 and B2 cleared")
        : "Locked · finish B1 and B2";

      const b1Action = `
        <a href="#lesson"
           class="btn btn-ghost"
           data-view="lesson"
           data-module-id="B1"
           data-lesson-index="0">
          ${moduleProgress.B1 ? "Review" : "Resume"}
        </a>`;

      const b2Action = unlockedB2
        ? `<a href="#lesson"
              class="btn btn-ghost"
              data-view="lesson"
              data-module-id="B2"
              data-lesson-index="0">
             ${moduleProgress.B2 ? "Review" : "Enter"}
           </a>`
        : `<span class="pill">Locked</span>`;

      const b3Action = unlockedB3
        ? `<a href="#lesson"
              class="btn btn-ghost"
              data-view="lesson"
              data-module-id="B3"
              data-lesson-index="0">
             ${moduleProgress.B3 ? "Review" : "Enter"}
           </a>`
        : `<span class="pill">Locked</span>`;

      return `
        <div class="content-inner">
          <div class="card" style="margin-bottom:1rem;">
            <div class="card-glow-edge"></div>
            <div class="card-header">
              <div>
                <div class="card-title">Backtesting path</div>
                <div class="card-subtitle">
                  Beginner run. Clear a lesson or quiz to push the streak and unlock the next chapter.
                </div>
              </div>
              <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
                <a href="#learn" class="btn btn-primary" data-view="learn">
                  Continue path
                </a>
                <a href="#chart-lab" class="btn btn-ghost" data-view="chart-lab">
                  Open Chart Lab
                </a>
              </div>
            </div>
            <div class="grid grid-2 timeline-card">
              <div>
                <div class="stat-label">Account progression</div>
                <div class="stat-value">Level ${s.level}</div>
                <div class="pill-row">
                  <span class="pill">XP ${s.xp}/${s.xpToNext}</span>
                  <span class="pill">Tier Beginner</span>
                  <span class="pill">Mode Linear</span>
                </div>
              </div>
              <div>
                <div class="stat-label">Streak</div>
                <div class="stat-value">${s.streak} day streak</div>
                <div class="pill-row">
                  <span class="pill">Best ${s.bestStreak}</span>
                  <span class="pill">Daily quest ${s.tasksCompletedToday > 0 ? "cleared" : "not cleared"}</span>
                </div>
              </div>
            </div>

            <div class="timeline-track">
              <div class="timeline-track-active"></div>
            </div>
            <div class="timeline-nodes">
              <div class="timeline-node">1</div>
              <div class="timeline-node active">2</div>
              <div class="timeline-node active">3</div>
              <div class="timeline-node">4</div>
              <div class="timeline-node">5</div>
              <div class="timeline-node">6</div>
            </div>
          </div>

          <div class="grid grid-2">
            <div class="card card-soft">
              <div class="card-glow-edge"></div>
              <div class="card-header">
                <div>
                  <div class="card-title">Beginner chapters</div>
                  <div class="card-subtitle">Stone path for fundamentals.</div>
                </div>
                <span class="chip-small">Track Beginner</span>
              </div>
              <div class="module-list">
                <div class="module-item">
                  <div>
                    <span class="label">B1 Market basics</span><br>
                    <span class="meta">${b1Meta}</span>
                  </div>
                  ${b1Action}
                </div>

                <div class="module-item">
                  <div>
                    <span class="label">B2 Order types</span><br>
                    <span class="meta">${b2Meta}</span>
                  </div>
                  ${b2Action}
                </div>

                <div class="module-item">
                  <div>
                    <span class="label">B3 Risk management</span><br>
                    <span class="meta">${b3Meta}</span>
                  </div>
                  ${b3Action}
                </div>
              </div>
            </div>

            <div class="card card-soft">
              <div class="card-glow-edge"></div>
              <div class="card-header">
                <div>
                  <div class="card-title">Today</div>
                  <div class="card-subtitle">Clear one lesson to keep the fire lit.</div>
                </div>
              </div>
              <div class="module-list">
                <div class="module-item">
                  <div>
                    <span class="label">Daily quiz Candles vs bars</span><br>
                    <span class="meta">5 questions · +40 XP bonus</span>
                  </div>
                  <a href="#quiz" class="btn btn-primary" data-view="quiz">Start</a>
                </div>
                <div class="module-item">
                  <div>
                    <span class="label">Pattern check Trend or range</span><br>
                    <span class="meta">Chart snapshot · +25 XP</span>
                  </div>
                  <a href="#chart-lab" class="btn btn-ghost" data-view="chart-lab">View</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  };
})();
