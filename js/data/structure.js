// Static content structure for modules, lessons, tiers.
// Dummy data for V1. All real text can be filled later.

(function () {
  const structure = {
    tiers: {
      beginner: {
        id: "beginner",
        label: "Beginner",
        description: "Foundations of markets, order types, and basic risk."
      },
      intermediate: {
        id: "intermediate",
        label: "Intermediate",
        description: "Intraday playbook, more structure and routines."
      },
      expert: {
        id: "expert",
        label: "Expert",
        description: "Pattern, streak and exponential progression experiments."
      }
    },

    modules: {
      B1: {
        id: "B1",
        tier: "beginner",
        name: "Market basics",
        code: "B1",
        requiredLevel: 1,
        requiredModules: []
      },
      B2: {
        id: "B2",
        tier: "beginner",
        name: "Order types",
        code: "B2",
        requiredLevel: 4,
        requiredModules: ["B1"]
      },
      B3: {
        id: "B3",
        tier: "beginner",
        name: "Risk management",
        code: "B3",
        requiredLevel: 5,
        requiredModules: ["B1", "B2"]
      },
      I1: {
        id: "I1",
        tier: "intermediate",
        name: "Intraday playbook",
        code: "I1",
        requiredLevel: 10,
        requiredModules: ["B1", "B2", "B3"]
      },
      E1: {
        id: "E1",
        tier: "expert",
        name: "Streak tier experiments",
        code: "E1",
        requiredLevel: 20,
        requiredModules: ["I1"]
      }
    },

    lessons: {
      B1: [
        { id: "B1-L1", title: "What is a market", kind: "theory" },
        { id: "B1-L2", title: "Participants and sessions", kind: "theory" },
        { id: "B1-L3", title: "Price charts overview", kind: "theory" },
        { id: "B1-Q1", title: "Check: uptrend or range", kind: "quiz" }
      ],
      B2: [
        { id: "B2-L1", title: "Market vs limit orders", kind: "theory" },
        { id: "B2-L2", title: "Stops and stop limits", kind: "theory" },
        { id: "B2-Q1", title: "Order type scenarios", kind: "quiz" }
      ],
      B3: [
        { id: "B3-L1", title: "Risk per trade", kind: "theory" },
        { id: "B3-L2", title: "Win rate and payoff", kind: "theory" },
        { id: "B3-Q1", title: "Basic risk quiz", kind: "quiz" }
      ],
      I1: [
        { id: "I1-L1", title: "Session plan template", kind: "theory" },
        { id: "I1-Q1", title: "Intraday routine quiz", kind: "quiz" }
      ],
      E1: [
        { id: "E1-L1", title: "Exponential XP concept", kind: "theory" },
        { id: "E1-Q1", title: "High streak challenge", kind: "quiz" }
      ]
    },

    // Optional aggregated progress map placeholder
    progress: {}
  };

  window.PatternLab = window.PatternLab || {};
  window.PatternLab.structure = structure;
})();
