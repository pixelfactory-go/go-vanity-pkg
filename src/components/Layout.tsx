import { html } from 'hono/html'

export const Layout = (props: { title: string; children?: any }) => {
  return html`<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${props.title}</title>
      <link rel="stylesheet" href="/styles.css" />
      <script>
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark')
        }
      </script>
    </head>
    <body class="min-h-screen bg-background text-foreground antialiased">
      <main class="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        ${props.children}
      </main>
      <footer class="mt-auto border-t border-border bg-gradient-to-r from-blue-50/30 to-purple-50/30 dark:from-blue-950/10 dark:to-purple-950/10">
        <div class="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        </div>
      </footer>
    </body>
  </html>`
}
