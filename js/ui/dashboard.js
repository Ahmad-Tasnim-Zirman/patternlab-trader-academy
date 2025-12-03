(function () {
  window.PatternLab = window.PatternLab || {};

  window.PatternLab.dashboard = {
    render() {
      const s = PatternLab.state.get();

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
                <button class="btn btn-primary" data-view="learn">
                  Continue path
                </button>
                <button class="btn btn-ghost" data-view="chart-lab">
                  Open Chart Lab
                </button>
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
                  <span class="pill">Daily quest not cleared</span>
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
                    <span class="meta">In progress · 3 of 7 lessons</span>
                  </div>
                  <button class="btn btn-ghost" data-view="learn">Resume</button>
                </div>
                <div class="module-item">
                  <div>
                    <span class="label">B2 Order types</span><br>
                    <span class="meta">Locked · unlock at level 4</span>
                  </div>
                  <span class="pill">Locked</span>
                </div>
                <div class="module-item">
                  <div>
                    <span class="label">B3 Risk management</span><br>
                    <span class="meta">Locked · finish B1 and B2</span>
                  </div>
                  <span class="pill">Locked</span>
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
                  <button class="btn btn-primary" data-view="quiz">Start</button>
                </div>
                <div class="module-item">
                  <div>
                    <span class="label">Pattern check Trend or range</span><br>
                    <span class="meta">Chart snapshot · +25 XP</span>
                  </div>
                  <button class="btn btn-ghost" data-view="chart-lab">View</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  };
})();
