/**
 * Theme Toggle Script for go-vanity-pkg
 * Manages theme switching between light and dark modes
 * Persists preference in localStorage
 */

(function() {
  // LocalStorage key for theme preference
  const THEME_KEY = 'theme-preference'

  /**
   * Apply theme to document
   * @param {string} theme - 'light' or 'dark'
   */
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  /**
   * Update toggle button ARIA label
   * Icons automatically switch via Tailwind dark: classes
   * @param {string} theme - Current theme ('light' or 'dark')
   */
  function updateToggleButton(theme) {
    const button = document.getElementById('theme-toggle')
    if (!button) return

    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    button.setAttribute('aria-label', `Switch to ${nextTheme} mode`)
  }

  /**
   * Initialize theme on page load
   * Checks localStorage first, falls back to system preference
   */
  function initTheme() {
    try {
      const saved = localStorage.getItem(THEME_KEY)
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

      // Validate saved theme value
      const validTheme = (saved === 'light' || saved === 'dark') ? saved : null
      const theme = validTheme || (systemPrefersDark ? 'dark' : 'light')

      applyTheme(theme)
      updateToggleButton(theme)
    } catch (e) {
      // Graceful fallback if localStorage is unavailable
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      applyTheme(systemPrefersDark ? 'dark' : 'light')
      updateToggleButton(systemPrefersDark ? 'dark' : 'light')
    }
  }

  /**
   * Toggle between light and dark themes
   * Called by button onclick handler
   */
  function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark')
    const newTheme = isDark ? 'light' : 'dark'

    applyTheme(newTheme)
    updateToggleButton(newTheme)

    // Save to localStorage with error handling
    try {
      localStorage.setItem(THEME_KEY, newTheme)
    } catch (e) {
      // Theme still toggles, just doesn't persist
      // Silently fail - no need to warn user about localStorage issues
    }
  }

  // Expose functions globally for button onclick and testing
  window.toggleTheme = toggleTheme
  window.initTheme = initTheme

  // Expose for testing only
  if (typeof window !== 'undefined' && window.__VITEST__) {
    window.applyTheme = applyTheme
    window.updateToggleButton = updateToggleButton
  }

  // Initialize theme when script loads
  initTheme()
})()

