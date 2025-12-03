(function () {
  window.PatternLab = window.PatternLab || {};

  window.PatternLab.profile = {
    render() {
      const s = PatternLab.state.get();

      return `
        <div class="content-inner">
          <div class="card">
            <div class="card-glow-edge"></div>
            <div class="card-header">
              <div>
                <div class="card-title">Profile stub</div>
                <div class="card-subtitle">
                  Later this screen stores preferences, theme, and progression in localStorage.
                </div>
              </div>
            </div>
            <div class="grid grid-2">
              <div>
                <div class="stat-label">Name</div>
                <div class="stat-value">${s.username}</div>
                <div class="pill-row">
                  <span class="pill">Tier Beginner</span>
                  <span class="pill">Level ${s.level}</span>
                </div>
              </div>
              <div>
                <div class="stat-label">Streak</div>
                <div class="stat-value">${s.streak} sessions</div>
                <div class="pill-row">
                  <span class="pill">Best ${s.bestStreak}</span>
                  <span class="pill">Theme toggle stored locally</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  };
})();
