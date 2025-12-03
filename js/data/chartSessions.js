// Dummy OHLC sessions for Chart Lab. No real market data.

(function () {
  window.PatternLab = window.PatternLab || {};

  // Simple helper to make candle objects clearer
  function c(o, h, l, close) {
    return { o, h, l, c: close };
  }

  const chartSessions = [
    {
      id: "B1_UPTREND_20",
      label: "Beginner: clean uptrend",
      timeframeMinutes: 5,
      startTime: "09:30",       // HH:MM, session local time
      market: "FAKE/USD",
      description:
        "Smooth intraday uptrend with small pullbacks. Used for first pattern checks.",
      candles: [
        c(100, 105, 98, 104),
        c(104, 108, 103, 107),
        c(107, 110, 106, 106),
        c(106, 109, 104, 105),
        c(105, 111, 104, 110),
        c(110, 113, 109, 112),
        c(112, 115, 111, 113),
        c(113, 116, 112, 115),
        c(115, 118, 114, 117),
        c(117, 119, 115, 116),
        c(116, 118, 113, 114),
        c(114, 115, 110, 111),
        c(111, 113, 108, 109),
        c(109, 110, 105, 106),
        c(106, 109, 104, 108),
        c(108, 111, 107, 110),
        c(110, 114, 109, 113),
        c(113, 117, 112, 116),
        c(116, 120, 115, 119),
        c(119, 121, 117, 118)
      ]
    },
    {
      id: "B1_RANGE_BREAKOUT_24",
      label: "Beginner: range then breakout",
      timeframeMinutes: 5,
      startTime: "10:00",
      market: "FAKE/USD",
      description:
        "Flat range with fake pushes, then a clean upside breakout. Later used for breakout quizzes.",
      candles: [
        c(50, 51, 49.5, 50.2),
        c(50.2, 50.8, 49.8, 50.1),
        c(50.1, 50.7, 49.9, 50.0),
        c(50.0, 50.6, 49.7, 49.9),
        c(49.9, 50.4, 49.6, 50.0),
        c(50.0, 50.5, 49.8, 50.3),
        c(50.3, 50.9, 50.0, 50.2),
        c(50.2, 50.7, 49.9, 50.0),
        c(50.0, 50.3, 49.7, 49.8),
        c(49.8, 50.1, 49.5, 49.9),
        // slight fake down
        c(49.9, 50.0, 49.2, 49.4),
        c(49.4, 49.8, 49.1, 49.6),
        // recovery to range top
        c(49.6, 50.2, 49.5, 50.0),
        c(50.0, 50.5, 49.9, 50.3),
        // breakout sequence
        c(50.3, 51.0, 50.2, 50.9),
        c(50.9, 51.5, 50.8, 51.3),
        c(51.3, 52.0, 51.1, 51.8),
        c(51.8, 52.4, 51.6, 52.2),
        c(52.2, 52.8, 52.0, 52.5),
        // post breakout drift
        c(52.5, 53.0, 52.3, 52.8),
        c(52.8, 53.2, 52.6, 53.0),
        c(53.0, 53.4, 52.8, 53.1),
        c(53.1, 53.5, 52.9, 53.2),
        c(53.2, 53.6, 53.0, 53.4)
      ]
    }
  ];

  window.PatternLab.chartSessions = chartSessions;
})();
