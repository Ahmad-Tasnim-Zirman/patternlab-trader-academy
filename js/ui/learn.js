(function () {
  window.PatternLab = window.PatternLab || {};

  window.PatternLab.learn = {
    render() {
      const structure = PatternLab.structure;
      let unlockedB2 = false;

      if (structure && PatternLab.progression) {
        unlockedB2 = PatternLab.progression.isModuleUnlocked("B2", structure);
      }

      const b2Meta = unlockedB2
        ? "Unlocked · you can enter this module"
        : "Locked · level 4 and B1 required";

      const b2Action = unlockedB2
        ? '<button class="btn btn-primary">Enter</button>'
        : '<span class="pill">Locked</span>';

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
                    <span class="meta">Unlocked · recommended first</span>
                  </div>
                  <button class="btn btn-primary">Enter</button>
                </div>
                <div class="module-item">
                  <div>
                    <span class="label">B2 Orders and execution</span><br>
                    <span class="meta">${b2Meta}</span>
                  </div>
                  ${b2Action}
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
