import { html } from 'hono/html'
import { Pkg } from '../config'

export const PkgPage = (props: { pkg: Pkg }) => {
  const pkg = props.pkg

  return html`<!DOCTYPE html>
  <html>
    <head>
      <meta name="go-import" content="${pkg.modulePath} ${pkg.vcs} https://${pkg.repo}">
      <meta name="go-source" content="${pkg.modulePath} https://${pkg.repo} https://${pkg.repo}/tree/master{/dir} https://${pkg.repo}/tree/master{/dir}/{file}#L{line}">
      <meta http-equiv="refresh" content="0; url=https://${pkg.godoc}/${pkg.modulePath}">
    </head>
  <body>
    Nothing to see here. Please go to<a href="https://${pkg.godoc}/${pkg.modulePath}"></a>.
  </body>
  </html>
  `
} 
