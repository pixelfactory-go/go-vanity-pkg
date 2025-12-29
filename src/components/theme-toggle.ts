/**
 * Theme Toggle Module for go-vanity-pkg
 * Manages theme switching between light and dark modes
 * Persists preference in localStorage
 */

// LocalStorage key for theme preference
const THEME_KEY = 'theme-preference'

/**
 * Apply theme to document
 * @param theme - 'light' or 'dark'
 */
export function applyTheme(theme: string): void {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

/**
 * Update toggle button ARIA label
 * Icons automatically switch via Tailwind dark: classes
 * @param theme - Current theme ('light' or 'dark')
 */
export function updateToggleButton(theme: string): void {
  const button = document.getElementById('theme-toggle')
  if (!button) return

  const nextTheme = theme === 'dark' ? 'light' : 'dark'
  button.setAttribute('aria-label', `Switch to ${nextTheme} mode`)
}

/**
 * Initialize theme on page load
 * Checks localStorage first, falls back to system preference
 */
export function initTheme(): void {
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
export function toggleTheme(): void {
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

// Expose functions globally for button onclick handler
if (typeof window !== 'undefined') {
  ;(window as any).toggleTheme = toggleTheme
  ;(window as any).initTheme = initTheme
}

// Auto-initialize when module loads (for browser usage)
if (typeof document !== 'undefined') {
  initTheme()
}
