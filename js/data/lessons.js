// Rich content for lessons, keyed by lesson id.
// Values are plain HTML strings, so we can render directly.

(function () {
  window.PatternLab = window.PatternLab || {};

  const lessonsContent = {
    // =====================
    // B1 – Market basics
    // =====================

    "B1-L1": `
      <p>
        Markets are matching engines. Every trade is a match between a buyer and a seller
        at a specific price and size. <strong>Nothing else is happening</strong> underneath the chart.
      </p>
      <p>
        In this beginner track we treat the market as a simple auction:
      </p>
      <ul>
        <li>Buyers place bids (prices they are willing to pay).</li>
        <li>Sellers place asks (prices they are willing to sell at).</li>
        <li>When a bid meets an ask, a trade prints and the last traded price updates.</li>
      </ul>
      <p>
        Every candle, bar or line you see on a chart is just a compressed view of these trades
        over a certain period of time (1 minute, 5 minutes, 1 day, etc.).
      </p>
    `,

    "B1-L2": `
      <p>
        Not everyone in the market has the same goal or time horizon. Understanding who is
        likely active helps you interpret moves more realistically.
      </p>
      <ul>
        <li><strong>Scalpers</strong> – hold for seconds to minutes, focus on tiny moves and size.</li>
        <li><strong>Day traders</strong> – flat by the end of the session, focus on intraday structure.</li>
        <li><strong>Swing traders</strong> – hold for days to weeks, care more about bigger swings.</li>
        <li><strong>Investors</strong> – hold for months or years, focus on fundamentals and macro.</li>
      </ul>
      <p>
        The same price move can mean something very different to each group. PatternLab
        teaches you to think like a day trader, but you must be aware that other players are
        pushing and absorbing orders on larger time frames.
      </p>
    `,

    "B1-L3": `
      <p>
        Price charts are just different ways of encoding the same raw trade data.
        You must be comfortable reading at least one style fluently.
      </p>
      <ul>
        <li><strong>Line charts</strong> – show only close price over time, very simplified.</li>
        <li><strong>Candlesticks</strong> – show open, high, low, close in each candle.</li>
        <li><strong>Bar charts</strong> – similar to candles, but with a different visual style.</li>
      </ul>
      <p>
        For pattern work we usually use candlesticks because they make intraday highs and lows
        visually obvious. Later, PatternLab will let you switch chart types and see the same
        pattern expressed in multiple views.
      </p>
    `,

    // Quiz lesson content is short; the actual questions are in quizzes.js
    "B1-Q1": `
      <p>
        This is the first pattern check for the B1 module. You will see a simplified
        price scenario and choose whether it is an uptrend, downtrend or range.
      </p>
      <p>
        Completing this quiz marks the B1 check as done and gives a small XP boost.
      </p>
    `,

    // =====================
    // B2 – Order types (dummy body)
    // =====================

    "B2-L1": `
      <p>
        Market orders hit the best available price right now. Limit orders wait for price
        to come to them. You need both in a realistic day–trading playbook.
      </p>
      <p>
        In PatternLab we care about how order choice affects:
      </p>
      <ul>
        <li>Fill price (slippage).</li>
        <li>Certainty of execution.</li>
        <li>Risk of missing the trade entirely.</li>
      </ul>
      <p>
        Later modules will tie these choices into concrete entry and exit rules.
      </p>
    `,

    "B2-L2": `
      <p>
        Stop orders are conditional orders that become active only when price crosses a
        trigger. They are a core tool for enforcing risk management rules.
      </p>
      <p>
        In this prototype module we only track the basic idea, not the full exchange mechanics.
      </p>
    `,

    "B2-Q1": `
      <p>
        This check asks which order type you would use in a few simple scenarios
        (breakout, pullback, and stop–loss placement).
      </p>
    `
  };

  window.PatternLab.lessonsContent = lessonsContent;
})();
