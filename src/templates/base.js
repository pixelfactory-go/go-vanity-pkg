export const baseLayout = (title, content) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
    </head>
    <body>${content}</body>
  </html>
`;

export const pageLayout = (title, content) => baseLayout(title, `
  <main>
    ${content}
    <footer>Powered by @worker-tools/html</footer>
  </main>
`);

