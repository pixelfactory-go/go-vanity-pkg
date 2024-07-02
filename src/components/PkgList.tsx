import { html } from 'hono/html'
import { Pkg } from '../config'

export const PkgList = (props: { pkgs: Pkg[] }) => {
  return html`
    <div class="row table-header">
      <div class="five columns"><strong>Package</strong></div>
      <div class="five columns"><strong>Source</strong></div>
      <div class="two columns"><strong>Documentation</strong></div>
    </div>
    ${props.pkgs.map((pkg) => {
      return html`<hr class="separator"/>
        <div class="row">
          <div class="five columns name">
            ${pkg.modulePath}
          </div>
          <div class="five columns">
            <a href="https://${pkg.repo}">${pkg.repo}</a>
          </div>
          <div class="two columns">
            <a href="https://${pkg.godoc}/${pkg.modulePath}">
            <img src="${pkg.docBadge}" alt="Go Reference" />
            </a>
          </div>
          ${pkg.description ? html`<div class="row">
            <div class="twelve columns description">
              ${pkg.description}
            </div>` : ''}
        </div>`
    })}
  `
}
