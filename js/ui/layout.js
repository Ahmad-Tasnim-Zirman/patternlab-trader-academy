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
                    <span>${s.xp} / ${s.xpToNext}</span>
                  </div>
                  <div class="xp-bar">
                    <div class="xp-bar-fill" id="xp-fill"></div>
                    <div class="xp-bar-spark" id="xp-spark"></div>
                  </div>
                </div>
                <div class="topbar-right">
                  <span class="tier-badge">Beginner</span>
                  <span class="level-pill">Level ${s.level}</span>
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
      const fill = document.getElementById("xp-fill");
      const spark = document.getElementById("xp-spark");
      if (!fill) return;
      const pct = xpPercent();
      fill.style.width = pct + "%";
      if (spark) {
        spark.style.left = Math.max(0, Math.min(100, pct)) + "%";
        spark.style.opacity = pct > 0 ? 0.5 : 0.0;
      }
    },

    bindNavClicks() {
      const links = document.querySelectorAll(".sidebar-link, .btn[data-view]");
      links.forEach(function (el) {
        el.addEventListener("click", function (evt) {
          const view = el.getAttribute("data-view");
          if (view) {
            evt.preventDefault();
            window.location.hash = view === "dashboard" ? "#dashboard" : "#" + view;
          }
        });
      });

      // Daily quiz demo hook
      const dailyQuiz = document.querySelector(".js-daily-quiz");
      if (dailyQuiz && window.PatternLab && PatternLab.events) {
        dailyQuiz.addEventListener("click", function () {
          PatternLab.events.emit("task:result", {
            type: "dailyQuiz",
            success: true,
            xpFull: 40,
            xpPartial: 20
          });
        });
      }
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

      let html = "";
      switch (name) {
        case "dashboard":
          html = PatternLab.dashboard.render();
          break;
        case "learn":
          html = PatternLab.learn.render();
          break;
        case "chartLab":
          html = PatternLab.chartLab.render();
          break;
        case "profile":
          html = PatternLab.profile.render();
          break;
        default:
          html = PatternLab.dashboard.render();
      }

      target.innerHTML = html;
      layout.bindNavClicks();
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
