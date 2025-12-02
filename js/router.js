(function () {
const routes = {
    "": "dashboard",
    "#dashboard": "dashboard",
    "#learn": "learn",
    "#lesson": "lesson",
    "#quiz": "quiz",
    "#chart-lab": "chartLab",
    "#profile": "profile"
};

function handleRoute() {
    const hash = window.location.hash || "";
    const view = routes[hash] || "dashboard";
    PatternLab.layout.renderView(view);
}

window.PatternLab = window.PatternLab || {};
window.PatternLab.router = {
init() {
    window.addEventListener("hashchange", handleRoute);
    handleRoute();
}
};
})();
