// Tiny event bus for decoupling UI and logic.

(function () {
  const handlers = {};

  function on(eventName, cb) {
    if (!handlers[eventName]) handlers[eventName] = [];
    handlers[eventName].push(cb);
  }

  function off(eventName, cb) {
    const list = handlers[eventName];
    if (!list) return;
    const idx = list.indexOf(cb);
    if (idx >= 0) list.splice(idx, 1);
  }

  function emit(eventName, payload) {
    const list = handlers[eventName];
    if (!list || list.length === 0) return;
    list.forEach(function (cb) {
      try {
        cb(payload);
      } catch (err) {
        console.error("PatternLab event handler error for", eventName, err);
      }
    });
  }

  window.PatternLab = window.PatternLab || {};
  window.PatternLab.events = {
    on,
    off,
    emit
  };
})();
