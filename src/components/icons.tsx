import { ExternalLink, FileText, Github, Moon, Package, Sun } from 'lucide-static'
import { html, raw } from 'hono/html'

// Helper to render lucide icons as raw HTML
const renderIcon = (svg: string, className?: string) => {
  if (!className) return html`${raw(svg)}`

  const withClass = svg.includes('class="')
    ? svg.replace('class="', `class="${className} `)
    : svg.replace('<svg', `<svg class="${className}"`)

  return html`${raw(withClass)}`
}

export const PackageIcon = (props: { className?: string }) => {
  return renderIcon(Package, props.className)
}

export const GithubIcon = (props: { className?: string }) => {
  return renderIcon(Github, props.className)
}

export const FileTextIcon = (props: { className?: string }) => {
  return renderIcon(FileText, props.className)
}

export const ExternalLinkIcon = (props: { className?: string }) => {
  return renderIcon(ExternalLink, props.className)
}

export const SunIcon = (props: { className?: string }) => {
  return renderIcon(Sun, props.className)
}

export const MoonIcon = (props: { className?: string }) => {
  return renderIcon(Moon, props.className)
}
