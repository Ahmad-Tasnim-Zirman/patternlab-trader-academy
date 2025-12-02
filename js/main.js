(function () {
    window.PatternLab = window.PatternLab || {};

    document.addEventListener("DOMContentLoaded", function () {
    const appRoot = document.getElementById("app");

    PatternLab.state.init();
    PatternLab.layout.renderAppShell(appRoot);
    PatternLab.router.init();
    });
})();
