// Chart Lab: interactive fake candlestick chart for pattern practice.
// Pulls data from PatternLab.chartSessions.

(function () {
  window.PatternLab = window.PatternLab || {};

  function getActiveSession() {
    const sessions = window.PatternLab.chartSessions || [];
    if (!sessions.length) {
      return {
        id: "EMPTY",
        label: "No sessions defined",
        timeframeMinutes: 5,
        startTime: "09:30",
        market: "FAKE/EMPTY",
        description: "You have no chartSessions configured.",
        candles: []
      };
    }
    // For now: just use the first session.
    return sessions[0];
  }

  function parseStartTime(str) {
    // "HH:MM" -> minutes
    const parts = (str || "09:30").split(":");
    const h = parseInt(parts[0] || "9", 10);
    const m = parseInt(parts[1] || "30", 10);
    return h * 60 + m;
  }

  function timeLabelForIndex(session, i) {
    const baseMinutes = parseStartTime(session.startTime);
    const step = session.timeframeMinutes || 5;
    const minutes = baseMinutes + i * step;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const hh = (h < 10 ? "0" : "") + h;
    const mm = (m < 10 ? "0" : "") + m;
    return hh + ":" + mm;
  }

  function getRange(data) {
    let min = Infinity;
    let max = -Infinity;
    data.forEach(d => {
      if (d.l < min) min = d.l;
      if (d.h > max) max = d.h;
    });
    if (!isFinite(min) || !isFinite(max)) {
      min = 0;
      max = 1;
    }
    return { min, max };
  }

  function renderChart(container, session, hoverIndex) {
    const canvas = container.querySelector("#chart-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const hud = container.querySelector("#chart-hud");
    const candles = session.candles || [];

    const rect = canvas.getBoundingClientRect();
    const width = rect.width || container.clientWidth || 600;
    const height = rect.height || 260;

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    // Price axis on the right, minimal padding on left
    const padding = { top: 16, right: 60, bottom: 28, left: 16 };

    const plotW = width - padding.left - padding.right;
    const plotH = height - padding.top - padding.bottom;

    const { min, max } = getRange(candles);
    const range = max - min || 1;

    function y(price) {
      const norm = (price - min) / range;
      return padding.top + (1 - norm) * plotH;
    }

    // Background
    ctx.save();
    ctx.fillStyle = "#020617";
    ctx.fillRect(padding.left, padding.top, plotW, plotH);
    ctx.restore();

    // Grid
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

    // Y axis line on the right
    const yAxisX = width - padding.right;
    ctx.save();
    ctx.strokeStyle = "#1f2937";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(yAxisX, padding.top);
    ctx.lineTo(yAxisX, padding.top + plotH);
    ctx.stroke();
    ctx.restore();

    // Y axis labels on the right
    ctx.save();
    ctx.fillStyle = "#9ca3af";
    ctx.font = "10px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    for (let i = 0; i <= gridLines; i++) {
      const gy = padding.top + (plotH / gridLines) * i;
      const price = max - (range / gridLines) * i;
      ctx.fillText(price.toFixed(1), yAxisX + 4, gy);
    }
    ctx.restore();

    // X axis line
    const xAxisY = padding.top + plotH;
    ctx.save();
    ctx.strokeStyle = "#1f2937";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, xAxisY);
    ctx.lineTo(width - padding.right, xAxisY);
    ctx.stroke();
    ctx.restore();

    // X axis ticks + labels
    ctx.save();
    ctx.fillStyle = "#9ca3af";
    ctx.font = "10px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.strokeStyle = "#1f2937";

    const n = candles.length;
    if (n > 0) {
      const candleSlot = plotW / Math.max(n, 1);
      const tickIndices = [
        0,
        Math.floor(n * 0.25),
        Math.floor(n * 0.5),
        Math.floor(n * 0.75),
        n - 1
      ];

      tickIndices.forEach(idx => {
        if (idx < 0 || idx >= n) return;
        const cx = padding.left + candleSlot * idx + candleSlot / 2;
        ctx.beginPath();
        ctx.moveTo(cx, xAxisY);
        ctx.lineTo(cx, xAxisY + 4);
        ctx.stroke();
        ctx.fillText(timeLabelForIndex(session, idx), cx, xAxisY + 6);
      });
    }
    ctx.restore();

    // Candles
    if (n > 0) {
      const candleSlot = plotW / Math.max(n, 1);
      const bodyWidth = Math.max(4, Math.floor(candleSlot * 0.4));

      candles.forEach((d, i) => {
        const cx = padding.left + candleSlot * i + candleSlot / 2;

        const yHigh = y(d.h);
        const yLow = y(d.l);
        const yOpen = y(d.o);
        const yClose = y(d.c);

        const bullish = d.c >= d.o;
        const isHover = typeof hoverIndex === "number" && i === hoverIndex;

        const wickColor = bullish ? "#22c55e" : "#ef4444";
        const bodyColor = bullish ? "#16a34a" : "#b91c1c";

        ctx.strokeStyle = wickColor;
        ctx.lineWidth = isHover ? 2 : 1;

        // Wick
        ctx.beginPath();
        ctx.moveTo(cx, yHigh);
        ctx.lineTo(cx, yLow);
        ctx.stroke();

        // Body
        const top = Math.min(yOpen, yClose);
        const bottom = Math.max(yOpen, yClose);
        const h = Math.max(2, bottom - top);

        ctx.fillStyle = bodyColor;
        ctx.globalAlpha = isHover ? 1.0 : 0.9;
        ctx.fillRect(cx - bodyWidth / 2, top, bodyWidth, h);
        ctx.globalAlpha = 1.0;
      });

      // Last close price line
      const last = candles[candles.length - 1];
      if (last) {
        const yp = y(last.c);
        ctx.save();
        ctx.strokeStyle = "rgba(251,191,36,0.7)";
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(padding.left, yp);
        ctx.lineTo(width - padding.right, yp);
        ctx.stroke();
        ctx.restore();
      }
    }

    // Crosshair + HUD for hover candle
    if (typeof hoverIndex === "number" && hoverIndex >= 0 && hoverIndex < n) {
      const d = candles[hoverIndex];
      const candleSlot = plotW / Math.max(n, 1);
      const cx = padding.left + candleSlot * hoverIndex + candleSlot / 2;
      const yc = y(d.c);

      // Crosshair
      ctx.save();
      ctx.strokeStyle = "rgba(248,250,252,0.6)";
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1;

      // Vertical
      ctx.beginPath();
      ctx.moveTo(cx, padding.top);
      ctx.lineTo(cx, padding.top + plotH);
      ctx.stroke();

      // Horizontal
      ctx.beginPath();
      ctx.moveTo(padding.left, yc);
      ctx.lineTo(width - padding.right, yc);
      ctx.stroke();
      ctx.restore();

      // Only time label at bottom, price read directly from right axis
      const timeText = timeLabelForIndex(session, hoverIndex);
      const timeBoxY = xAxisY + 4;

      ctx.save();
      ctx.font = "10px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.textBaseline = "top";
      ctx.textAlign = "center";

      const timeW = ctx.measureText(timeText).width;
      const tBoxW = timeW + 8;
      const tBoxH = 14;

      ctx.fillStyle = "#020617";
      ctx.strokeStyle = "rgba(148,163,184,0.6)";
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.roundRect(cx - tBoxW / 2, timeBoxY, tBoxW, tBoxH, 3);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#e5e7eb";
      ctx.fillText(timeText, cx, timeBoxY + 3);
      ctx.restore();

      if (hud) {
        hud.textContent =
          session.market +
          " · " +
          timeText +
          " · O " +
          d.o.toFixed(2) +
          "  H " +
          d.h.toFixed(2) +
          "  L " +
          d.l.toFixed(2) +
          "  C " +
          d.c.toFixed(2);
      }
    } else if (hud) {
      hud.textContent =
        session.market +
        " · " +
        (session.label || "Chart session") +
        " · Hover the chart to inspect time and price.";
    }
  }

  window.PatternLab.chartLab = {
    render() {
      const session = getActiveSession();

      return `
        <div class="content-inner" id="chart-lab-root">
          <div class="card" style="margin-bottom:1rem;">
            <div class="card-glow-edge"></div>
            <div class="card-header">
              <div>
                <div class="card-title">Chart Lab prototype</div>
                <div class="card-subtitle">
                  ${session.label || "Interactive fake session"} · ${session.market}
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
                  ${session.description || "No description provided."}
                </div>
              </div>
              <div class="pill-row">
                <span class="pill">Dummy OHLC</span>
                <span class="pill">${session.timeframeMinutes || 5}m candles</span>
              </div>
            </div>

            <div style="padding:0.5rem 0.75rem 0.4rem;">
              <div style="border-radius:0.75rem;border:1px solid rgba(15,23,42,0.9);background:#020617;padding:0.4rem 0.6rem 0.6rem;">
                <canvas id="chart-canvas" style="width:100%;height:260px;display:block;"></canvas>
              </div>
            </div>

            <div style="padding:0 0.75rem 0.75rem;font-size:0.8rem;color:var(--text-muted);">
              <div id="chart-hud"></div>
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

      const session = getActiveSession();
      const candles = session.candles || [];

      let hoverIndex = null;

      function redraw() {
        renderChart(root, session, hoverIndex);
      }

      // Initial draw
      redraw();

      function computeHoverIndex(evt) {
        const rect = canvas.getBoundingClientRect();
        const x = evt.clientX - rect.left;
        const width = canvas.width;

        const padding = { top: 16, right: 60, bottom: 28, left: 16 };
        const plotW = width - padding.left - padding.right;

        const n = candles.length;
        if (n === 0) return null;

        const candleSlot = plotW / n;
        const xInPlot = x - padding.left;

        if (xInPlot < 0 || xInPlot > plotW) return null;

        let idx = Math.floor(xInPlot / candleSlot);
        if (idx < 0) idx = 0;
        if (idx >= n) idx = n - 1;
        return idx;
      }

      canvas.addEventListener("mousemove", function (evt) {
        const idx = computeHoverIndex(evt);
        if (idx === hoverIndex) return;
        hoverIndex = idx;
        redraw();
      });

      canvas.addEventListener("mouseleave", function () {
        if (hoverIndex === null) return;
        hoverIndex = null;
        redraw();
      });

      window.addEventListener("resize", redraw);
    }
  };
})();
