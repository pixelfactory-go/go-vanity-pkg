import { icons } from 'lucide'
import { html } from 'hono/html'

// Helper to render lucide icons as raw HTML
const renderIcon = (iconName: keyof typeof icons, className?: string) => {
  const iconData = icons[iconName]
  if (!iconData) return ''

  // Convert icon data array to SVG paths
  const paths = iconData.map((item: any) => {
    const [tag, attrs] = item
    const attrString = Object.entries(attrs)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ')
    return `<${tag} ${attrString} />`
  }).join('')

  return html`<svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="${className || ''}"
  >${html([paths])}</svg>`
}

export const PackageIcon = (props: { className?: string }) => {
  return renderIcon('Package', props.className)
}

export const GithubIcon = (props: { className?: string }) => {
  return renderIcon('Github', props.className)
}

export const FileTextIcon = (props: { className?: string }) => {
  return renderIcon('FileText', props.className)
}

export const ExternalLinkIcon = (props: { className?: string }) => {
  return renderIcon('ExternalLink', props.className)
}

// Sun and Moon icons for theme toggle (exported as strings for vanilla JS)
export const SunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-foreground group-hover:text-yellow-500 transition-colors" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`

export const MoonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-foreground group-hover:text-blue-600 transition-colors" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`
