(function () {
  window.PatternLab = window.PatternLab || {};

  document.addEventListener("DOMContentLoaded", function () {
    const root = document.getElementById("app");

    PatternLab.state.init();
    PatternLab.progression.onAppOpen();

    // Restore theme before mount if stored
    try {
      const stored = localStorage.getItem("patternlab-theme");
      if (stored === "theme-cyber") {
        document.body.classList.remove("theme-dragon");
        document.body.classList.add("theme-cyber");
      }
    } catch (_) {}

    PatternLab.layout.mount(root);
    PatternLab.router.init();
    PatternLab.layout.renderView("dashboard");

    // Wire task events to progression
    if (PatternLab.events && PatternLab.progression) {
      PatternLab.events.on("task:result", function (payload) {
        PatternLab.progression.registerTaskResult(payload || {});
        PatternLab.layout.updateXpBar();

        const currentHash = window.location.hash || "#dashboard";
        const route = currentHash.replace("#", "") || "dashboard";
        PatternLab.layout.renderView(route);
      });
    }
  });
})();
