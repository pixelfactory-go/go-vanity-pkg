"use strict";
(() => {
  // src/components/theme-toggle.ts
  var THEME_KEY = "theme-preference";
  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
  function updateToggleButton(theme) {
    const button = document.getElementById("theme-toggle");
    if (!button) return;
    const nextTheme = theme === "dark" ? "light" : "dark";
    button.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
  }
  function initTheme() {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const validTheme = saved === "light" || saved === "dark" ? saved : null;
      const theme = validTheme || (systemPrefersDark ? "dark" : "light");
      applyTheme(theme);
      updateToggleButton(theme);
    } catch (e) {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      applyTheme(systemPrefersDark ? "dark" : "light");
      updateToggleButton(systemPrefersDark ? "dark" : "light");
    }
  }
  function toggleTheme() {
    const isDark = document.documentElement.classList.contains("dark");
    const newTheme = isDark ? "light" : "dark";
    applyTheme(newTheme);
    updateToggleButton(newTheme);
    try {
      localStorage.setItem(THEME_KEY, newTheme);
    } catch (e) {
    }
  }
  if (typeof window !== "undefined") {
    ;
    window.toggleTheme = toggleTheme;
    window.initTheme = initTheme;
  }
  if (typeof document !== "undefined") {
    initTheme();
  }
})();
