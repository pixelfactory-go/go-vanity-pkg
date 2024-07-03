import { html } from 'hono/html'

export const Layout = (props: { title: string; children?: any }) => {
  return html`<!DOCTYPE html>
  <html>
    <head>
      <title>${props.title}</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.min.css" />
      <style>
        .description { 
          color: #666;
          padding-top: 5px;
          max-width: 400px;
        }
        .cell {
          vertical-align: top;
        }
      </style>
    </head>
    <body>
      <div class="container">
        ${props.children}
      </div>
    </body>
  </html>`
}
