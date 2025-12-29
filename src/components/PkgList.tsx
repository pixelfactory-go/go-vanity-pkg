import { html } from 'hono/html'
import { Pkg } from '../config'
import { PackageIcon, GithubIcon, FileTextIcon, ExternalLinkIcon } from './icons'

export const PkgList = (props: { pkgs: Pkg[] }) => {
  return html`
    <!-- Mobile: Card layout -->
    <div class="grid gap-4 md:hidden">
      ${props.pkgs.map((pkg) => html`
        <div class="p-4 border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-950/20 rounded-lg border border-border">
          <div class="space-y-3">
            <div class="flex items-start gap-2">
              ${PackageIcon({ className: 'h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5' })}
              <h3 class="font-mono text-sm font-semibold text-foreground break-all">${pkg.modulePath}</h3>
            </div>
            <div class="flex flex-col gap-2">
              <a
                href="https://${pkg.repo}"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-2 text-sm text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                ${GithubIcon({ className: 'h-4 w-4' })}
                <span class="break-all">${pkg.repo}</span>
                ${ExternalLinkIcon({ className: 'h-3 w-3 shrink-0' })}
              </a>
              <a
                href="https://${pkg.godoc}/${pkg.modulePath}"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors font-medium"
              >
                ${FileTextIcon({ className: 'h-4 w-4' })}
                <span>View Documentation</span>
                ${ExternalLinkIcon({ className: 'h-3 w-3 shrink-0' })}
              </a>
            </div>
          </div>
        </div>
      `)}
    </div>

    <!-- Desktop: Table layout -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b-2 border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
            <th class="pb-4 pt-4 pl-4 text-left text-sm font-semibold text-foreground">Package</th>
            <th class="pb-4 pt-4 text-left text-sm font-semibold text-foreground">Source</th>
            <th class="pb-4 pt-4 pr-4 text-left text-sm font-semibold text-foreground">Documentation</th>
          </tr>
        </thead>
        <tbody>
          ${props.pkgs.map((pkg, index) => html`
            <tr class="border-b border-border last:border-0 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-950/20 dark:hover:to-purple-950/20 transition-colors ${index % 2 === 0 ? 'bg-slate-50/30 dark:bg-slate-900/20' : ''}">
              <td class="py-4 pl-4 pr-4">
                <div class="flex items-center gap-2">
                  ${PackageIcon({ className: 'h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0' })}
                  <code class="font-mono text-sm font-semibold text-foreground">${pkg.modulePath}</code>
                </div>
              </td>
              <td class="py-4 pr-4">
                <a
                  href="https://${pkg.repo}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors group"
                >
                  ${GithubIcon({ className: 'h-4 w-4' })}
                  <span>${pkg.repo}</span>
                  ${ExternalLinkIcon({ className: 'h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity' })}
                </a>
              </td>
              <td class="py-4 pr-4">
                <a
                  href="https://${pkg.godoc}/${pkg.modulePath}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors font-medium group"
                >
                  ${FileTextIcon({ className: 'h-4 w-4' })}
                  <span>Go Reference</span>
                  ${ExternalLinkIcon({ className: 'h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity' })}
                </a>
              </td>
            </tr>
          `)}
        </tbody>
      </table>
    </div>
  `
}
