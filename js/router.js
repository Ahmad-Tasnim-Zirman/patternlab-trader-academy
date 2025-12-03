(function () {
  const routes = {
    "": "dashboard",
    "#dashboard": "dashboard",
    "#learn": "learn",
    "#chart-lab": "chart-lab",
    "#profile": "profile",
    "#quiz": "quiz",
    "#lesson": "lesson"
  };

  function handleRoute() {
    const hash = window.location.hash || "#dashboard";
    const viewKey = routes[hash] || "dashboard";
    if (window.PatternLab && PatternLab.layout && PatternLab.layout.renderView) {
      PatternLab.layout.setActiveNav(viewKey);
      PatternLab.layout.renderView(viewKey);
    }
  }

  window.PatternLab = window.PatternLab || {};
  window.PatternLab.router = {
    init() {
      window.addEventListener("hashchange", handleRoute);
      handleRoute();
    }
  };
})();
