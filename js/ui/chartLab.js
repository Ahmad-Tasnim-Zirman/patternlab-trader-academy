(function () {
  window.PatternLab = window.PatternLab || {};

  window.PatternLab.chartLab = {
    render() {
      return `
        <div class="content-inner">
          <div class="card" style="margin-bottom:1rem;">
            <div class="card-glow-edge"></div>
            <div class="card-header">
              <div>
                <div class="card-title">Chart Lab prototype</div>
                <div class="card-subtitle">
                  TradingView inspired slate where pattern tasks and paper runs will live.
                </div>
              </div>
            </div>
            <div class="chart-shell">
              <div class="chart-toolbar">
                <div class="pill-row">
                  <span class="pill">Symbol FAKEUSD</span>
                  <span class="pill">Timeframe 5m</span>
                  <span class="pill">Style candles</span>
                </div>
                <div style="display:flex;gap:0.4rem;flex-wrap:wrap;">
                  <button class="btn btn-ghost">Paper trade stub</button>
                  <button class="btn btn-ghost">Pattern task</button>
                </div>
              </div>
              <div class="chart-display">
                <div class="chart-grid"></div>
                <div class="chart-line"></div>
                <div class="chart-caption">Dummy price path only. No real data.</div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  };
})();
