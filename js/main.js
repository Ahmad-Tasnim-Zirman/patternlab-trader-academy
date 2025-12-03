(function () {
  window.PatternLab = window.PatternLab || {};

  document.addEventListener("DOMContentLoaded", function () {
    const root = document.getElementById("app");

    PatternLab.state.init();

    // restore theme before mount if stored
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
  });
})();
