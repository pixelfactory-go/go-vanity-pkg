import { html } from 'hono/html'
import { SunIcon, MoonIcon } from './icons'

export const Layout = (props: { title: string; children?: any }) => {
  return html`<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${props.title}</title>
      <link rel="stylesheet" href="/styles.css" />
      <script>
        // Prevent Flash of Unstyled Content (FOUC)
        (function() {
          try {
            const theme = localStorage.getItem('theme-preference') ||
                          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
            if (theme === 'dark') {
              document.documentElement.classList.add('dark')
            }
          } catch (e) {
            // Fallback to system preference if localStorage unavailable
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
              document.documentElement.classList.add('dark')
            }
          }
        })()
      </script>
    </head>
    <body class="min-h-screen bg-background text-foreground antialiased">
      <button
        id="theme-toggle"
        onclick="toggleTheme()"
        class="fixed top-4 right-4 z-50 rounded-lg p-2 hover:bg-accent transition-colors group"
        aria-label="Toggle theme"
      >
        ${SunIcon({ className: 'h-5 w-5 text-foreground group-hover:text-yellow-500 transition-colors hidden dark:block' })}
        ${MoonIcon({ className: 'h-5 w-5 text-foreground group-hover:text-blue-600 transition-colors block dark:hidden' })}
      </button>
      <main class="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        ${props.children}
      </main>
      <script src="/theme-toggle.js" defer></script>
    </body>
  </html>`
}
