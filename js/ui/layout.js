(function () {
  function xpPercent() {
    const s = PatternLab.state.get();
    if (!s || !s.xpToNext) return 0;
    const pct = (s.xp / s.xpToNext) * 100;
    return Math.max(0, Math.min(100, pct));
  }

  const layout = {
    mount(root) {
      const s = PatternLab.state.get();

      root.innerHTML = `
        <div class="app-shell">
          <aside class="app-sidebar">
            <div class="sidebar-glow"></div>
            <div class="sidebar-logo">
              <span>PatternLab</span>
              <span class="badge">Trader</span>
            </div>

            <div class="sidebar-section">
              <div class="sidebar-section-label">Navigate</div>
              <nav class="sidebar-nav">
                <a href="#dashboard" class="sidebar-link" data-nav="dashboard">
                  <span class="icon">DB</span>
                  <span>Dashboard</span>
                </a>
                <a href="#learn" class="sidebar-link" data-nav="learn">
                  <span class="icon">LM</span>
                  <span>Learn map</span>
                </a>
                <a href="#chart-lab" class="sidebar-link" data-nav="chart-lab">
                  <span class="icon">CL</span>
                  <span>Chart Lab</span>
                </a>
                <a href="#profile" class="sidebar-link" data-nav="profile">
                  <span class="icon">PF</span>
                  <span>Profile</span>
                </a>
              </nav>
            </div>

            <div class="sidebar-foot">
              <div class="sidebar-foot-cta">
                PatternLab is a training ground. No live trading in this build.
              </div>
              <div class="sidebar-chip-row">
                <div class="sidebar-chip">Client side only</div>
                <div class="sidebar-chip">Dummy data</div>
              </div>
            </div>
          </aside>

          <main class="app-main">
            <header class="app-topbar">
              <div class="topbar-inner">
                <div class="topbar-left">
                  <div>
                    <div class="topbar-title">PatternLab trader academy</div>
                    <div class="topbar-tabs">
                      <span class="topbar-tab active">Dashboard</span>
                      <span class="topbar-tab">Courses</span>
                      <span class="topbar-tab">Quests</span>
                    </div>
                  </div>
                </div>
                <div class="topbar-center">
                  <div class="xp-meta">
                    <span>XP progression</span>
                    <span id="xp-meta-value">${s.xp} / ${s.xpToNext}</span>
                  </div>
                  <div class="xp-bar">
                    <div class="xp-bar-fill" id="xp-fill"></div>
                    <div class="xp-bar-spark" id="xp-spark"></div>
                  </div>
                </div>
                <div class="topbar-right">
                  <span class="tier-badge">Beginner</span>
                  <span class="level-pill" id="level-pill">Level ${s.level}</span>
                  <div class="streak-chip">
                    <span>${s.streak} streak</span>
                  </div>
                  <button class="theme-toggle" id="theme-toggle">
                    <span class="theme-toggle-label">Skin</span>
                    <span id="theme-toggle-text">Dragon</span>
                    <span class="theme-toggle-knob"></span>
                  </button>
                  <div class="user-pill">
                    ${s.username}
                  </div>
                </div>
              </div>
            </header>
            <section class="app-content">
              <div class="content-inner" id="app-content"></div>
            </section>
          </main>
        </div>
      `;

      layout.updateXpBar();
      layout.bindNavClicks();
      layout.bindThemeToggle();
    },

    updateXpBar() {
      const s = PatternLab.state.get();
      const fill = document.getElementById("xp-fill");
      const spark = document.getElementById("xp-spark");
      const label = document.getElementById("xp-meta-value");
      const levelEl = document.getElementById("level-pill");

      let pct = 0;
      if (s && s.xpToNext) {
        pct = Math.max(0, Math.min(100, (s.xp / s.xpToNext) * 100));
      }

      if (fill) {
        fill.style.width = pct + "%";
        if (spark) {
          spark.style.left = pct + "%";
          spark.style.opacity = pct > 0 ? 0.5 : 0.0;
        }
      }

      if (label && s) {
        label.textContent = s.xp + " / " + s.xpToNext;
      }

      if (levelEl && s) {
        levelEl.textContent = "Level " + s.level;
      }
    },

    bindNavClicks() {
      const all = document.querySelectorAll("[data-view]");
      all.forEach(el => {
        el.onclick = (e) => {
          e.preventDefault();
          const view = el.getAttribute("data-view");
          if (!view) return;

          if (view === "lesson" && PatternLab.lessonView && PatternLab.lessonView.setContext) {
            const moduleId = el.getAttribute("data-module-id") || "B1";
            const idx = parseInt(el.getAttribute("data-lesson-index") || "0", 10);
            PatternLab.lessonView.setContext(moduleId, idx);
          }

          window.location.hash = "#" + view;
        };
      });
    },


    setActiveNav(routeName) {
      const links = document.querySelectorAll(".sidebar-link");
      links.forEach(function (link) {
        const nav = link.getAttribute("data-nav");
        if (!nav) return;
        if (nav === routeName) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    },

    renderView(name) {
      const target = document.getElementById("app-content");
      if (!target) return;

      const map = {
        dashboard: PatternLab.dashboard,
        learn: PatternLab.learn,
        "chart-lab": PatternLab.chartLab,
        chartLab: PatternLab.chartLab,
        profile: PatternLab.profile,
        quiz: PatternLab.quiz,
        lesson: PatternLab.lessonView
      };

      let module = map[name];
      if (!module || typeof module.render !== "function") {
        module = PatternLab.dashboard;
        name = "dashboard";
      }

      target.innerHTML = module.render();

      this.bindNavClicks();

      if (name === "quiz" && PatternLab.quiz && typeof PatternLab.quiz.bindEvents === "function") {
        PatternLab.quiz.bindEvents();
      }

      if (name === "lesson" && PatternLab.lessonView && typeof PatternLab.lessonView.bindEvents === "function") {
        PatternLab.lessonView.bindEvents();
      }
    },


    bindThemeToggle() {
      const btn = document.getElementById("theme-toggle");
      const label = document.getElementById("theme-toggle-text");
      if (!btn) return;

      btn.addEventListener("click", function () {
        const body = document.body;
        const isDragon = body.classList.contains("theme-dragon");
        const nextClass = isDragon ? "theme-cyber" : "theme-dragon";

        body.classList.remove("theme-dragon", "theme-cyber");
        body.classList.add(nextClass);

        if (label) {
          label.textContent = nextClass === "theme-dragon" ? "Dragon" : "Cyber";
        }

        try {
          localStorage.setItem("patternlab-theme", nextClass);
        } catch (_) {}
      });

      try {
        const stored = localStorage.getItem("patternlab-theme");
        if (stored === "theme-cyber") {
          document.body.classList.remove("theme-dragon");
          document.body.classList.add("theme-cyber");
          if (label) label.textContent = "Cyber";
        }
      } catch (_) {}
    }
  };

  window.PatternLab = window.PatternLab || {};
  window.PatternLab.layout = layout;
})();
