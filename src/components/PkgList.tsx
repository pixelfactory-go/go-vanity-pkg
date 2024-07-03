import { html } from 'hono/html'
import { Pkg } from '../config'

export const PkgList = (props: { pkgs: Pkg[] }) => {
  return html`
  <table class="u-full-width">
  <thead>
    <tr>
      <th>Packages</th>
      <th>Sources</th>
      <th>Docs</th>
    </tr>
  </thead>

  <tbody>
  ${props.pkgs.map((pkg) => {
    return html`
    <tr>
      <td class="cell">
        <b>${pkg.modulePath}</b>
        ${pkg.description ? html`<div class="description">${pkg.description}</div>` : ''}
      </td>
      <td class="cell">
        <a href="https://${pkg.repo}">${pkg.repo}</a>
      </td>
      <td class="cell">
        <a href="https://${pkg.godoc}/${pkg.modulePath}">
          <img src="${pkg.docBadge}" alt="Go Reference" />
        </a>
      </td>
    </tr>`
  })}
  </tbody>
  </table>`
}
