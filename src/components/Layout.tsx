import { html } from 'hono/html'

export const Layout = (props: { title: string; children?: any }) => {
  return html`<!DOCTYPE html>
  <html>
    <head>
      <title>${props.title}</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.min.css" />
    </head>
    <style>
      .separator {
        margin: 0.25em 0;
      }
      .description { color: #666; }

      /* On narrow screens, switch to inline headers. */
      .table-header { display: none; }
      .inline-header { font-weight: bold; }
      @media (min-width: 550px) {
        .table-header { display: block; }
        .inline-header { display: none; }
      }

      @media (prefers-color-scheme: dark) {
        body { background-color: #333; color: #ddd; }
        a { color: #ddd; }
        a:visited { color: #bbb; }
          .description { color: #bbb; }
          .separator { border-color: #666; }
      }
    </style>
    <body>
      <div class="container">
        ${props.children}
      </div>
    </body>
  </html>`
}
