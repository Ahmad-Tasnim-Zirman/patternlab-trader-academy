// Chart Lab: interactive fake candlestick session simulator.
// - Uses PatternLab.chartSessions as data source
// - Price axis on the right
// - Free crosshair + HUD + time/price panel + price tag
// - Progressive reveal: scroll (mouse wheel) to reveal more candles
// - Click + drag to pan horizontally

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
    // For now: just use the first defined session.
    return sessions[0];
  }

  function parseStartTime(str) {
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

  // hoverState: null or { x, y } in canvas coordinates
  // windowStart: index in full session where current view begins
  function renderChart(container, session, hoverState, visibleCount, windowStart) {
    const canvas = container.querySelector("#chart-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const hud = container.querySelector("#chart-hud");
    const panel = container.querySelector("#chart-info-panel");

    const allCandles = session.candles || [];
    const maxSlice = Math.max(0, Math.min(visibleCount, allCandles.length));
    const safeStart = Math.max(
      0,
      Math.min(Math.max(0, allCandles.length - maxSlice), windowStart || 0)
    );
    const candles = allCandles.slice(safeStart, safeStart + maxSlice);

    const rect = canvas.getBoundingClientRect();
    const width = rect.width || container.clientWidth || 900;
    const height = rect.height || 420;

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    // Price axis on the right, minimal padding on left
    const padding = { top: 20, right: 70, bottom: 32, left: 16 };

    const plotW = width - padding.left - padding.right;
    const plotH = height - padding.top - padding.bottom;

    const { min, max } = getRange(candles.length ? candles : allCandles);
    const range = max - min || 1;

    function yFromPrice(price) {
      const norm = (price - min) / range;
      return padding.top + (1 - norm) * plotH;
    }

    function priceFromY(y) {
      const clamped = Math.max(padding.top, Math.min(padding.top + plotH, y));
      const norm = 1 - (clamped - padding.top) / plotH;
      return min + norm * range;
    }

    // Background pane
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

    // Price axis on the right
    const yAxisX = width - padding.right;
    ctx.save();
    ctx.strokeStyle = "#1f2937";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(yAxisX, padding.top);
    ctx.lineTo(yAxisX, padding.top + plotH);
    ctx.stroke();
    ctx.restore();

    // Price labels on the right
    ctx.save();
    ctx.fillStyle = "#9ca3af";
    ctx.font = "11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    for (let i = 0; i <= gridLines; i++) {
      const gy = padding.top + (plotH / gridLines) * i;
      const price = max - (range / gridLines) * i;
      ctx.fillText(price.toFixed(1), yAxisX + 4, gy);
    }
    ctx.restore();

    // Time axis line
    const xAxisY = padding.top + plotH;
    ctx.save();
    ctx.strokeStyle = "#1f2937";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, xAxisY);
    ctx.lineTo(width - padding.right, xAxisY);
    ctx.stroke();
    ctx.restore();

    // Time ticks + labels
    ctx.save();
    ctx.fillStyle = "#9ca3af";
    ctx.font = "11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
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

      tickIndices.forEach(idxLocal => {
        if (idxLocal < 0 || idxLocal >= n) return;
        const cx = padding.left + candleSlot * idxLocal + candleSlot / 2;
        const idxGlobal = safeStart + idxLocal;
        ctx.beginPath();
        ctx.moveTo(cx, xAxisY);
        ctx.lineTo(cx, xAxisY + 4);
        ctx.stroke();
        ctx.fillText(timeLabelForIndex(session, idxGlobal), cx, xAxisY + 6);
      });
    }
    ctx.restore();

    // Candles
    if (n > 0) {
      const candleSlot = plotW / Math.max(n, 1);
      const bodyWidth = Math.max(5, Math.floor(candleSlot * 0.4));

      candles.forEach((d, i) => {
        const cx = padding.left + candleSlot * i + candleSlot / 2;

        const yHigh = yFromPrice(d.h);
        const yLow = yFromPrice(d.l);
        const yOpen = yFromPrice(d.o);
        const yClose = yFromPrice(d.c);

        const bullish = d.c >= d.o;

        const wickColor = bullish ? "#22c55e" : "#ef4444";
        const bodyColor = bullish ? "#16a34a" : "#b91c1c";

        ctx.strokeStyle = wickColor;
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

        ctx.fillStyle = bodyColor;
        ctx.globalAlpha = 0.9;
        ctx.fillRect(cx - bodyWidth / 2, top, bodyWidth, h);
        ctx.globalAlpha = 1.0;
      });

      // Last visible close price line + price tag on axis
      const last = candles[candles.length - 1];
      if (last) {
        const yp = yFromPrice(last.c);

        // Line
        ctx.save();
        ctx.strokeStyle = "rgba(251,191,36,0.7)";
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(padding.left, yp);
        ctx.lineTo(width - padding.right, yp);
        ctx.stroke();
        ctx.restore();

        // Price tag at right
        ctx.save();
        ctx.setLineDash([]);
        ctx.font = "11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
        const label = last.c.toFixed(2);
        const paddingX = 6;
        const paddingY = 3;
        const textW = ctx.measureText(label).width;
        const boxW = textW + paddingX * 2;
        const boxH = 18;

        const boxX = yAxisX - 2;
        const boxY = Math.max(
          padding.top,
          Math.min(padding.top + plotH - boxH, yp - boxH / 2)
        );

        ctx.fillStyle = "#fbbf24";
        ctx.strokeStyle = "rgba(15,23,42,0.9)";
        ctx.lineWidth = 1;

        if (ctx.roundRect) {
          ctx.beginPath();
          ctx.roundRect(boxX, boxY, boxW, boxH, 3);
          ctx.fill();
          ctx.stroke();
        } else {
          ctx.fillRect(boxX, boxY, boxW, boxH);
          ctx.strokeRect(boxX, boxY, boxW, boxH);
        }

        ctx.fillStyle = "#111827";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(label, boxX + paddingX, boxY + boxH / 2);
        ctx.restore();
      }
    }

    let panelText = "";

    // Free crosshair + HUD for arbitrary hover position
    if (hoverState && n > 0) {
      let { x, y } = hoverState;

      const plotLeft = padding.left;
      const plotRight = padding.left + plotW;
      const plotTop = padding.top;
      const plotBottom = padding.top + plotH;

      x = Math.max(plotLeft, Math.min(plotRight, x));
      y = Math.max(plotTop, Math.min(plotBottom, y));

      const candleSlot = plotW / Math.max(n, 1);
      const xInPlot = x - plotLeft;

      const idxFloat = xInPlot / candleSlot;
      const nearestIndexLocal = Math.max(0, Math.round(idxFloat));
      const clampedLocal = Math.max(0, Math.min(n - 1, nearestIndexLocal));
      const d = candles[clampedLocal];

      const idxGlobal = safeStart + nearestIndexLocal;
      const priceAtCursor = priceFromY(y);
      const timeText = timeLabelForIndex(session, idxGlobal);

      // Crosshair
      ctx.save();
      ctx.strokeStyle = "rgba(248,250,252,0.6)";
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(x, plotTop);
      ctx.lineTo(x, plotBottom);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(plotLeft, y);
      ctx.lineTo(plotRight, y);
      ctx.stroke();
      ctx.restore();

      // Time label under x-axis, following crosshair
      const timeBoxY = xAxisY + 4;
      ctx.save();
      ctx.font = "11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.textBaseline = "top";
      ctx.textAlign = "center";

      const timeW = ctx.measureText(timeText).width;
      const tBoxW = timeW + 8;
      const tBoxH = 16;

      ctx.fillStyle = "#020617";
      ctx.strokeStyle = "rgba(148,163,184,0.6)";
      ctx.lineWidth = 1;

      const tBoxX = Math.max(
        plotLeft + tBoxW / 2,
        Math.min(plotRight - tBoxW / 2, x)
      );

      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(tBoxX - tBoxW / 2, timeBoxY, tBoxW, tBoxH, 3);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillRect(tBoxX - tBoxW / 2, timeBoxY, tBoxW, tBoxH);
        ctx.strokeRect(tBoxX - tBoxW / 2, timeBoxY, tBoxW, tBoxH);
      }

      ctx.fillStyle = "#e5e7eb";
      ctx.fillText(timeText, tBoxX, timeBoxY + 3);
      ctx.restore();

      // Price tag for crosshair on right axis
      ctx.save();
      ctx.font = "11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
      const priceLabel = priceAtCursor.toFixed(2);
      const pPadX = 6;
      const pPadY = 3;
      const pTextW = ctx.measureText(priceLabel).width;
      const pBoxW = pTextW + pPadX * 2;
      const pBoxH = 18;
      const pBoxX = yAxisX - pBoxW - 4;
      const pBoxY = Math.max(
        padding.top,
        Math.min(padding.top + plotH - pBoxH, y - pBoxH / 2)
      );

      ctx.fillStyle = "#020617";
      ctx.strokeStyle = "rgba(148,163,184,0.7)";
      ctx.lineWidth = 1;

      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(pBoxX, pBoxY, pBoxW, pBoxH, 3);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillRect(pBoxX, pBoxY, pBoxW, pBoxH);
        ctx.strokeRect(pBoxX, pBoxY, pBoxW, pBoxH);
      }

      ctx.fillStyle = "#e5e7eb";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(priceLabel, pBoxX + pPadX, pBoxY + pBoxH / 2);
      ctx.restore();

      // HUD + info panel
      if (d) {
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

        panelText =
          "T " +
          timeText +
          " · P " +
          priceAtCursor.toFixed(2) +
          " · C " +
          d.c.toFixed(2);
      }
    } else {
      if (hud) {
        hud.textContent =
          session.market +
          " · " +
          (session.label || "Chart session") +
          " · Scroll / drag to explore, hover to inspect.";
      }
      if (n > 0) {
        const lastGlobalIdx = safeStart + n - 1;
        const last = candles[candles.length - 1];
        panelText =
          "Last " + timeLabelForIndex(session, lastGlobalIdx) +
          " · C " + last.c.toFixed(2);
      } else {
        panelText = "No data · dummy session";
      }
    }

    if (panel) {
      panel.textContent = panelText;
    }

    // Hint: remaining candles left/right
    const allCount = (session.candles || []).length;
    if (allCount > 0 && maxSlice > 0 && (safeStart > 0 || safeStart + maxSlice < allCount)) {
      const remainingLeft = safeStart;
      const remainingRight = allCount - (safeStart + maxSlice);
      const hintParts = [];
      if (remainingLeft > 0) hintParts.push(remainingLeft + " earlier");
      if (remainingRight > 0) hintParts.push(remainingRight + " later");
      const hint = hintParts.join(" · ");

      ctx.save();
      ctx.font = "11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillStyle = "rgba(148,163,184,0.8)";
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      ctx.fillText(hint, width - padding.right, padding.top + plotH - 4);
      ctx.restore();
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
                <div class="card-title">Chart Lab · Session simulator</div>
                <div class="card-subtitle">
                  ${session.label || "Interactive fake session"} · ${
                    session.market
                  } · ${session.timeframeMinutes || 5}m candles
                </div>
              </div>
              <a href="#dashboard" class="btn btn-ghost" data-view="dashboard">Back to dashboard</a>
            </div>
          </div>

          <div class="card card-soft" style="margin-bottom:1rem;">
            <div class="card-glow-edge"></div>
            <div class="card-header">
              <div>
                <div class="card-title">Main view</div>
                <div class="card-subtitle">
                  Scroll to reveal more candles. Click–drag to pan across the session.
                  Hover for free crosshair with time/price readout.
                </div>
              </div>
              <div class="pill-row">
                <span class="pill">Session: ${session.id}</span>
                <span class="pill">Timeframe ${session.timeframeMinutes || 5}m</span>
              </div>
            </div>

            <div style="padding:0.5rem 0.9rem 0.6rem;">
              <div style="
                position:relative;
                border-radius:0.9rem;
                border:1px solid rgba(15,23,42,0.95);
                background:#020617;
                padding:0.4rem 0.6rem 0.7rem;
              ">
                <canvas
                  id="chart-canvas"
                  style="width:100%;height:420px;display:block;cursor:crosshair;"
                ></canvas>
                <div
                  id="chart-info-panel"
                  style="
                    position:absolute;
                    top:0.45rem;
                    right:0.6rem;
                    padding:0.18rem 0.5rem;
                    border-radius:999px;
                    font-size:0.78rem;
                    background:rgba(15,23,42,0.95);
                    border:1px solid rgba(148,163,184,0.6);
                    color:var(--text-muted);
                    pointer-events:none;
                  "
                ></div>
              </div>
            </div>

            <div style="padding:0 0.9rem 0.8rem;font-size:0.8rem;color:var(--text-muted);">
              <div id="chart-hud"></div>
            </div>
          </div>

          <div class="card card-soft">
            <div class="card-glow-edge"></div>
            <div class="card-header">
              <div>
                <div class="card-title">Session notes</div>
                <div class="card-subtitle">
                  ${session.description || "No description provided."}
                </div>
              </div>
            </div>
            <div style="padding:0.75rem 0.9rem 0.9rem;font-size:0.85rem;color:var(--text-muted);">
              <p style="margin-bottom:0.4rem;">
                This is a dummy session. Later, Chart Lab will attach pattern recognition
                prompts, annotation tasks and scoring directly to segments of this chart.
              </p>
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
      const allCandles = session.candles || [];

      let visibleCount = Math.min(8, allCandles.length);  // progressive reveal
      let windowStart = 0;                                // pan offset
      let hoverState = null;

      let isDragging = false;
      let dragStartX = 0;
      let dragStartWindowStart = 0;

      function redraw() {
        renderChart(root, session, hoverState, visibleCount, windowStart);
      }

      redraw();

      // Hover / crosshair
      canvas.addEventListener("mousemove", function (evt) {
        const rect = canvas.getBoundingClientRect();

        if (isDragging) {
          const dx = evt.clientX - dragStartX;

          const width = canvas.width || rect.width || 900;
          const paddingLeft = 16;
          const paddingRight = 70;
          const plotW = width - paddingLeft - paddingRight;
          const n = Math.max(1, Math.min(visibleCount, allCandles.length));
          const candleSlot = plotW / n;

          const deltaCandles = Math.round(-dx / candleSlot); // drag left → later candles
          const maxStart = Math.max(0, allCandles.length - visibleCount);
          windowStart = Math.max(
            0,
            Math.min(maxStart, dragStartWindowStart + deltaCandles)
          );

          hoverState = null; // avoid weird crosshair offset while dragging
          redraw();
          return;
        }

        const x = evt.clientX - rect.left;
        const y = evt.clientY - rect.top;
        hoverState = { x, y };
        redraw();
      });

      canvas.addEventListener("mouseleave", function () {
        hoverState = null;
        isDragging = false;
        redraw();
      });

      // Drag start / end
      canvas.addEventListener("mousedown", function (evt) {
        isDragging = true;
        dragStartX = evt.clientX;
        dragStartWindowStart = windowStart;
      });

      window.addEventListener("mouseup", function () {
        isDragging = false;
      });

      // Progressive reveal using mouse wheel scroll
      canvas.addEventListener(
        "wheel",
        function (evt) {
          evt.preventDefault();
          if (evt.deltaY > 0) {
            const max = allCandles.length;
            if (visibleCount < max) {
              visibleCount += 1;
            }
          } else if (evt.deltaY < 0) {
            const minVisible = Math.min(6, allCandles.length);
            if (visibleCount > minVisible) {
              visibleCount -= 1;
            }
          }

          const maxStart = Math.max(0, allCandles.length - visibleCount);
          if (windowStart > maxStart) windowStart = maxStart;

          redraw();
        },
        { passive: false }
      );

      // Re-render on resize
      window.addEventListener("resize", function () {
        hoverState = null;
        redraw();
      });
    }
  };
})();
