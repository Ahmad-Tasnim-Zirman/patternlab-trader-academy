// Chart Lab: simple fake candlestick view for pattern practice.

(function () {
  window.PatternLab = window.PatternLab || {};

  // Dummy OHLC data (no real market).
  const candles = [
    { o: 100, h: 105, l: 98,  c: 104 },
    { o: 104, h: 108, l: 103, c: 107 },
    { o: 107, h: 110, l: 106, c: 106 },
    { o: 106, h: 109, l: 104, c: 105 },
    { o: 105, h: 111, l: 104, c: 110 },
    { o: 110, h: 113, l: 109, c: 112 },
    { o: 112, h: 115, l: 111, c: 113 },
    { o: 113, h: 116, l: 112, c: 115 },
    { o: 115, h: 118, l: 114, c: 117 },
    { o: 117, h: 119, l: 115, c: 116 },
    { o: 116, h: 118, l: 113, c: 114 },
    { o: 114, h: 115, l: 110, c: 111 },
    { o: 111, h: 113, l: 108, c: 109 },
    { o: 109, h: 110, l: 105, c: 106 },
    { o: 106, h: 109, l: 104, c: 108 },
    { o: 108, h: 111, l: 107, c: 110 },
    { o: 110, h: 114, l: 109, c: 113 },
    { o: 113, h: 117, l: 112, c: 116 },
    { o: 116, h: 120, l: 115, c: 119 },
    { o: 119, h: 121, l: 117, c: 118 }
  ];

  function getRange(data) {
    let min = Infinity;
    let max = -Infinity;
    data.forEach(d => {
      if (d.l < min) min = d.l;
      if (d.h > max) max = d.h;
    });
    return { min, max };
  }

  function renderChart(container) {
    const canvas = container.querySelector("#chart-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width || container.clientWidth || 600;
    const height = rect.height || 260;

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    const padding = { top: 16, right: 24, bottom: 20, left: 40 };

    const plotW = width - padding.left - padding.right;
    const plotH = height - padding.top - padding.bottom;

    const { min, max } = getRange(candles);
    const range = max - min || 1;

    function y(price) {
      const norm = (price - min) / range;      // 0..1
      return padding.top + (1 - norm) * plotH; // invert for canvas
    }

    // Background grid
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.strokeStyle = "#1f2937";
    ctx.lineWidth = 1;

    const gridLines = 4;
    for (let i = 0; i <= gridLines; i++) {
      const gy = padding.top + (plotH / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, gy);
      ctx.lineTo(width - padding.right, gy);
      ctx.stroke();
    }
    ctx.restore();

    // Price labels
    ctx.save();
    ctx.fillStyle = "#9ca3af";
    ctx.font = "10px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    for (let i = 0; i <= gridLines; i++) {
      const gy = padding.top + (plotH / gridLines) * i;
      const price = max - (range / gridLines) * i;
      ctx.fillText(price.toFixed(1), padding.left - 6, gy);
    }
    ctx.restore();

    // Candles
    const n = candles.length;
    const candleSlot = plotW / Math.max(n, 1);
    const bodyWidth = Math.max(4, Math.floor(candleSlot * 0.4));

    candles.forEach((d, i) => {
      const cx = padding.left + candleSlot * i + candleSlot / 2;

      const yHigh = y(d.h);
      const yLow = y(d.l);
      const yOpen = y(d.o);
      const yClose = y(d.c);

      const bullish = d.c >= d.o;

      ctx.strokeStyle = bullish ? "#22c55e" : "#ef4444";
      ctx.lineWidth = 1;

      // Wick
      ctx.beginPath();
      ctx.moveTo(cx, yHigh);
      ctx.lineTo(cx, yLow);
      ctx.stroke();

      // Body
      const top = Math.min(yOpen, yClose);
      const bottom = Math.max(yOpen, yClose);
      const h = Math.max(2, bottom - top);

      ctx.fillStyle = bullish ? "#16a34a" : "#b91c1c";
      ctx.fillRect(cx - bodyWidth / 2, top, bodyWidth, h);
    });

    // Simple current price line (last close)
    const last = candles[candles.length - 1];
    if (last) {
      const yp = y(last.c);
      ctx.save();
      ctx.strokeStyle = "rgba(251,191,36,0.75)";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(padding.left, yp);
      ctx.lineTo(width - padding.right, yp);
      ctx.stroke();
      ctx.restore();
    }
  }

  window.PatternLab.chartLab = {
    render() {
      return `
        <div class="content-inner" id="chart-lab-root">
          <div class="card" style="margin-bottom:1rem;">
            <div class="card-glow-edge"></div>
            <div class="card-header">
              <div>
                <div class="card-title">Chart Lab prototype</div>
                <div class="card-subtitle">
                  Fake intraday candles. No real data, only pattern rehearsal.
                </div>
              </div>
              <a href="#dashboard" class="btn btn-ghost" data-view="dashboard">Back to dashboard</a>
            </div>
          </div>

          <div class="card card-soft">
            <div class="card-glow-edge"></div>
            <div class="card-header">
              <div>
                <div class="card-title">Sample session</div>
                <div class="card-subtitle">
                  Uptrend sequence with minor pullbacks. Later, this area becomes a pattern–quiz target.
                </div>
              </div>
              <div class="pill-row">
                <span class="pill">Dummy OHLC</span>
                <span class="pill">Client-side only</span>
              </div>
            </div>

            <div style="padding:0.5rem 0.75rem 0.9rem;">
              <div style="border-radius:0.75rem;border:1px solid rgba(15,23,42,0.9);background:#020617;padding:0.4rem 0.6rem 0.6rem;">
                <canvas id="chart-canvas" style="width:100%;height:260px;display:block;"></canvas>
              </div>
            </div>

            <div style="padding:0 0.75rem 0.75rem;font-size:0.8rem;color:var(--text-muted);">
              <p style="margin-bottom:0.35rem;">
                This is only a visual shell. Later:
              </p>
              <ul style="list-style:disc;padding-left:1.1rem;">
                <li>Attach quiz prompts to segments of this chart.</li>
                <li>Let the user tag sections as trend / range / consolidation.</li>
                <li>Eventually plug in a dummy order–entry simulation.</li>
              </ul>
            </div>
          </div>
        </div>
      `;
    },

    bindEvents() {
      const root = document.getElementById("chart-lab-root");
      if (!root) return;

      const canvas = root.querySelector("#chart-canvas");
      if (!canvas) return;

      function redraw() {
        renderChart(root);
      }

      redraw();

      // naive resize hook for now
      window.addEventListener("resize", redraw);
    }
  };
})();
