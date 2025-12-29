/**
 * Theme Toggle Script for go-vanity-pkg
 * Manages theme switching between light and dark modes
 * Persists preference in localStorage
 */

// LocalStorage key for theme preference
const THEME_KEY = 'theme-preference'

// Icon SVG strings (from src/components/icons.tsx)
const SunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-foreground group-hover:text-yellow-500 transition-colors" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`

const MoonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-foreground group-hover:text-blue-600 transition-colors" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`

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
 * Update toggle button icon and ARIA label
 * @param {string} theme - Current theme ('light' or 'dark')
 */
function updateToggleButton(theme) {
  const button = document.getElementById('theme-toggle')
  if (!button) return

  // Show opposite icon (Moon in light mode, Sun in dark mode)
  const icon = theme === 'dark' ? SunIcon : MoonIcon
  const nextTheme = theme === 'dark' ? 'light' : 'dark'

  button.innerHTML = icon
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
    console.warn('Could not initialize theme:', e)
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
    console.warn('Could not save theme preference:', e)
  }
}

// Initialize theme when script loads
initTheme()
