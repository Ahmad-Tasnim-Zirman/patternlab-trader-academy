// Lesson viewer: shows lessons for a module and lets the user mark a lesson complete.

(function () {
  window.PatternLab = window.PatternLab || {};

  // Current lesson context
  const ctx = {
    moduleId: "B1",
    lessonIndex: 0
  };

  function setContext(moduleId, lessonIndex) {
    if (moduleId) ctx.moduleId = moduleId;
    if (Number.isFinite(lessonIndex)) ctx.lessonIndex = Math.max(0, lessonIndex);
  }

  function getModuleAndLessons() {
    const structure = PatternLab.structure || { modules: {}, lessons: {} };
    const module = structure.modules[ctx.moduleId] || {
      id: ctx.moduleId,
      name: "Unknown module"
    };
    const lessons = structure.lessons[ctx.moduleId] || [];
    const idx = Math.max(0, Math.min(ctx.lessonIndex, lessons.length - 1));
    ctx.lessonIndex = idx;
    return { module, lessons, idx };
  }

  function isLessonCompleted(moduleId, lessonId) {
    const s = PatternLab.state.get();
    const lp = s.lessonProgress || {};
    return !!(lp[moduleId] && lp[moduleId][lessonId]);
  }

  function renderLessonBody(lesson) {
    if (!lesson) {
      return `
        <p style="font-size:0.9rem;color:var(--text-muted);">
          No lesson selected.
        </p>
      `;
    }

    const map = PatternLab.lessonsContent || {};
    const html = map[lesson.id];

    if (html) {
      return html;
    }

    // Fallback if no content defined yet
    return `
      <p style="font-size:0.9rem;color:var(--text-muted);">
        Lesson <strong>${lesson.id}</strong> does not have custom content yet.
        This placeholder exists so the viewer still works while we fill out the curriculum.
      </p> `;
  }

  function renderSideList(module, lessons, activeIndex) {
    if (!lessons.length) {
      return `
        <div class="module-item">
          <div>
            <span class="label">No lessons yet</span><br>
            <span class="meta">This module has no lesson definitions.</span>
          </div>
        </div>
      `;
    }

    return lessons
      .map(function (lesson, index) {
        const completed = isLessonCompleted(module.id, lesson.id);
        const isActive = index === activeIndex;

        const badge = completed
          ? '<span class="pill">Done</span>'
          : isActive
          ? '<span class="pill">Current</span>'
          : '<span class="pill">Locked</span>';

        return `
          <div class="module-item" data-lesson-index="${index}" data-role="lesson-row">
            <div>
              <span class="label">${lesson.title}</span><br>
              <span class="meta">${lesson.kind === "quiz" ? "Quiz" : "Lesson"} · ${completed ? "Completed" : "Not completed"}</span>
            </div>
            ${badge}
          </div>
        `;
      })
      .join("");
  }

  window.PatternLab.lessonView = {
    setContext,

    render() {
      const { module, lessons, idx } = getModuleAndLessons();
      const current = lessons[idx];

      const completed = current
        ? isLessonCompleted(module.id, current.id)
        : false;

      const canGoPrev = idx > 0;
      const canGoNext = idx < lessons.length - 1;

      return `
        <div class="content-inner">
          <div class="card" style="margin-bottom:1rem;">
            <div class="card-glow-edge"></div>
            <div class="card-header">
              <div>
                <div class="card-title">${module.name || "Module " + module.id}</div>
                <div class="card-subtitle">
                  Prototype lesson viewer. Selecting and completing lessons updates XP and progress.
                </div>
              </div>
              <a href="#dashboard" class="btn btn-ghost" data-view="dashboard">Back to dashboard</a>
            </div>
          </div>

          <div class="grid grid-2">
            <div class="card card-soft">
              <div class="card-glow-edge"></div>
              <div class="card-header">
                <div>
                  <div class="card-title">Lessons</div>
                  <div class="card-subtitle">Pick a lesson in this module.</div>
                </div>
              </div>
              <div class="module-list" id="lesson-list">
                ${renderSideList(module, lessons, idx)}
              </div>
            </div>

            <div class="card card-soft">
              <div class="card-glow-edge"></div>
              <div class="card-header">
                <div>
                  <div class="card-title">Lesson detail</div>
                  <div class="card-subtitle">
                    ${current ? current.title : "Nothing selected"}
                  </div>
                </div>
              </div>
              <div id="lesson-body">
                ${renderLessonBody(current)}
              </div>
              <div style="margin-top:0.9rem;display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;">
                <button class="btn btn-ghost" data-role="prev-lesson" ${canGoPrev ? "" : "disabled"}>
                  Previous
                </button>
                <button class="btn btn-ghost" data-role="next-lesson" ${canGoNext ? "" : "disabled"}>
                  Next
                </button>
                <button class="btn btn-primary" data-role="complete-lesson" ${current && !completed ? "" : "disabled"}>
                  Mark lesson complete
                </button>
                <span style="font-size:0.8rem;color:var(--text-muted);margin-left:auto;">
                  ${completed ? "Already completed." : "Grants XP on completion."}
                </span>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    bindEvents() {
      const root = document.getElementById("app-content");
      if (!root) return;

      // Change lesson by clicking in the list
      root.querySelectorAll('[data-role="lesson-row"]').forEach(function (row) {
        row.addEventListener("click", function () {
          const idxAttr = row.getAttribute("data-lesson-index");
          const idx = parseInt(idxAttr || "0", 10);
          PatternLab.lessonView.setContext(ctx.moduleId, idx);
          PatternLab.layout.renderView("lesson");
        });
      });

      // Previous / next
      const prevBtn = root.querySelector('[data-role="prev-lesson"]');
      const nextBtn = root.querySelector('[data-role="next-lesson"]');

      if (prevBtn && !prevBtn.disabled) {
        prevBtn.addEventListener("click", function () {
          PatternLab.lessonView.setContext(ctx.moduleId, ctx.lessonIndex - 1);
          PatternLab.layout.renderView("lesson");
        });
      }

      if (nextBtn && !nextBtn.disabled) {
        nextBtn.addEventListener("click", function () {
          PatternLab.lessonView.setContext(ctx.moduleId, ctx.lessonIndex + 1);
          PatternLab.layout.renderView("lesson");
        });
      }

      // Complete lesson
      const completeBtn = root.querySelector('[data-role="complete-lesson"]');
      if (completeBtn && !completeBtn.disabled) {
        completeBtn.addEventListener("click", function () {
          const { module, lessons, idx } = getModuleAndLessons();
          const current = lessons[idx];
          if (!current) return;

          // Mark in lesson progress
          if (PatternLab.progression && PatternLab.progression.completeLesson) {
            PatternLab.progression.completeLesson(module.id, current.id);
          }

          // Award XP and streak tick
          if (PatternLab.events && PatternLab.progression) {
            PatternLab.events.emit("task:result", {
              type: "lesson",
              success: true,
              xpFull: 20,
              xpPartial: 0
            });
          }

          // Re-render viewer in-place
          PatternLab.layout.renderView("lesson");
          PatternLab.layout.updateXpBar();
        });
      }
    }
  };
})();
