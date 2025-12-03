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

  window.PatternLab.learn = {
    render() {
      const structure = PatternLab.structure;
      const state = PatternLab.state.get();

      const moduleProgress = computeModuleProgress(structure, state);

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
        : "Unlocked · recommended first";

      const b2Meta = unlockedB2
        ? (moduleProgress.B2
            ? "Completed · all lessons done"
            : "Unlocked · ready when you are")
        : "Locked · level 4 and B1 required";

      const b3Meta = unlockedB3
        ? (moduleProgress.B3
            ? "Completed · all lessons done"
            : "Unlocked · B1 and B2 cleared")
        : "Locked · finish B1 and B2";

      const b1Action = `
        <button class="btn btn-primary"
                data-view="lesson"
                data-module-id="B1"
                data-lesson-index="0">
          ${moduleProgress.B1 ? "Review" : "Enter"}
        </button>`;

      const b2Action = unlockedB2
        ? `<button class="btn btn-primary"
                   data-view="lesson"
                   data-module-id="B2"
                   data-lesson-index="0">
             ${moduleProgress.B2 ? "Review" : "Enter"}
           </button>`
        : `<span class="pill">Locked</span>`;

      const b3Action = unlockedB3
        ? `<button class="btn btn-primary"
                   data-view="lesson"
                   data-module-id="B3"
                   data-lesson-index="0">
             ${moduleProgress.B3 ? "Review" : "Enter"}
           </button>`
        : `<span class="pill">Locked</span>`;

      return `
        <div class="content-inner">
          <div class="card" style="margin-bottom:1rem;">
            <div class="card-glow-edge"></div>
            <div class="card-header">
              <div>
                <div class="card-title">Tier map</div>
                <div class="card-subtitle">
                  Beginner, Intermediate, Expert tiers laid out as a linear path that later adds exponential jumps.
                </div>
              </div>
            </div>
            <div class="pill-row">
              <span class="pill">Beginner linear</span>
              <span class="pill">Intermediate gated</span>
              <span class="pill">Expert streak powered</span>
            </div>
          </div>

          <div class="grid grid-2">
            <div class="card card-soft">
              <div class="card-glow-edge"></div>
              <div class="card-header">
                <div>
                  <div class="card-title">Beginner modules</div>
                  <div class="card-subtitle">No prior trading required.</div>
                </div>
              </div>
              <div class="module-list">
                <div class="module-item">
                  <div>
                    <span class="label">B1 Market structure</span><br>
                    <span class="meta">${b1Meta}</span>
                  </div>
                  ${b1Action}
                </div>

                <div class="module-item">
                  <div>
                    <span class="label">B2 Orders and execution</span><br>
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
                  <div class="card-title">Later tiers</div>
                  <div class="card-subtitle">Visible, but out of reach for now.</div>
                </div>
              </div>
              <div class="module-list">
                <div class="module-item">
                  <div>
                    <span class="label">Intermediate intraday playbook</span><br>
                    <span class="meta">Locked · reach level 10</span>
                  </div>
                  <span class="pill">Future tier</span>
                </div>
                <div class="module-item">
                  <div>
                    <span class="label">Expert streak tier</span><br>
                    <span class="meta">Locked · high streak needed</span>
                  </div>
                  <span class="pill">Future tier</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  };
})();
