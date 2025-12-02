(function () {
  function renderSidebar() {
    return `
      <aside class="app-sidebar">
        <div class="sidebar-inner">
          <div class="sidebar-logo">PatternLab</div>
          <nav class="sidebar-nav">
            <a href="#dashboard">Dashboard</a>
            <a href="#learn">Learn</a>
            <a href="#chart-lab">Chart Lab</a>
            <a href="#profile">Profile</a>
          </nav>
        </div>
      </aside>
    `;
  }

  function renderTopbar() {
    const state = PatternLab.state.get();
    const xpPercent = 0;

    return `
      <header class="app-topbar">
        <div class="topbar-inner">
          <div class="topbar-left">
            <span class="tier-badge">${state.currentTier}</span>
            <span class="level-label">Level ${state.level}</span>
          </div>
          <div class="topbar-center">
            <div class="xp-bar">
              <div class="xp-bar-fill" style="width: ${xpPercent}%;"></div>
            </div>
          </div>
          <div class="topbar-right">
            <span class="streak-label">🔥 ${state.streak}</span>
          </div>
        </div>
      </header>
    `;
  }

  function viewFor(name) {
    switch (name) {
      case "dashboard":
        return PatternLab.dashboard.render();
      case "learn":
        return PatternLab.learn.render();
      case "lesson":
        return PatternLab.lessonView.render();
      case "quiz":
        return PatternLab.quizView.render();
      case "chartLab":
        return PatternLab.chartLab.render();
      case "profile":
        return PatternLab.profile.render();
      default:
        return PatternLab.dashboard.render();
    }
  }

  let rootEl = null;

  window.PatternLab = window.PatternLab || {};
  window.PatternLab.layout = {
    renderAppShell(root) {
      rootEl = root;
      rootEl.innerHTML = `
        <div class="app-shell">
          ${renderSidebar()}
          <main class="app-main">
            ${renderTopbar()}
            <section class="app-content" id="app-content"></section>
          </main>
        </div>
      `;
    },
    renderView(name) {
      const content = document.getElementById("app-content");
      if (!content) return;
      content.innerHTML = viewFor(name);
    }
  };
})();
