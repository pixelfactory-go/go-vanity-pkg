# Go Vanity Package Server

A lightweight Go vanity import path server built with [Hono](https://hono.dev/) and deployed on [Cloudflare Workers](https://workers.cloudflare.com/).

## Features

- Custom Go vanity import paths with automatic pkg.go.dev integration
- Responsive web interface listing all packages
- Dark/light theme support with localStorage persistence
- Built with Hono for edge performance
- Deployed on Cloudflare Workers for global distribution
- Tailwind CSS styling

## Prerequisites

- Node.js (v18 or later)
- npm
- Cloudflare account (for deployment)
- Wrangler CLI (included in dev dependencies)

## Installation

```bash
npm install
```

## Configuration

### Setting Up Your Vanity Domain

1. **Configure your domain** in `src/config.ts`:

```typescript
export const config: Config = {
  godoc: "pkg.go.dev",           // Documentation host
  url: "go.yourdomain.com",      // Your vanity domain
  pkgs: [
    {
      name: "pkg/server",
      repo: "github.com/yourorg/server",
    },
    {
      name: "pkg/logger",
      repo: "github.com/yourorg/logger",
    },
  ],
};
```

2. **DNS Configuration**: Point your domain to your Cloudflare Worker
   - Add a DNS record (A, AAAA, or CNAME) for your vanity domain
   - Configure it as a route in your Cloudflare Worker settings

3. **Update wrangler.toml** if needed to add custom routes or domains

### Package Configuration

Each package in the `pkgs` array supports the following options:

#### Required Fields
- `name`: Path segment after your domain
  - Example: `"pkg/server"` creates `go.yourdomain.com/pkg/server`
- `repo`: Actual repository location
  - Example: `"github.com/yourorg/server"`

#### Optional Fields
- `url`: Override the global vanity domain for this package
  - Default: Uses `config.url`
- `godoc`: Override the documentation host
  - Default: Uses `config.godoc` (typically "pkg.go.dev")
- `vcs`: Version control system
  - Default: `"git"`
  - Options: `"git"`, `"hg"`, `"svn"`, `"bzr"`
- `description`: Package description displayed on the web interface
- `modulePath`: Full import path
  - Default: Auto-generated as `${url}/${name}`
- `docBadge`: Documentation badge URL
  - Default: Auto-generated as `//pkg.go.dev/badge/${modulePath}.svg`

### Configuration Example

```typescript
export const config: Config = {
  godoc: "pkg.go.dev",
  url: "go.example.com",
  pkgs: [
    {
      name: "pkg/http",
      repo: "github.com/example/http-server",
      description: "HTTP server utilities",
    },
    {
      name: "tools/cli",
      repo: "github.com/example/cli-tools",
      vcs: "git",
      description: "Command-line tools",
    },
  ],
};
```

This configuration allows users to import packages as:
```go
import "go.example.com/pkg/http"
import "go.example.com/tools/cli"
```

## Development

Start the development server with hot reload:

```bash
npm run dev
```

This will:
1. Build CSS from Tailwind
2. Build JavaScript theme toggle
3. Start Wrangler dev server

The server will be available at `http://localhost:8787`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build the project
- `npm run deploy` - Deploy to Cloudflare Workers
- `npm test` - Run tests
- `npm run coverage` - Run tests with coverage
- `npm run css:build` - Build CSS from Tailwind
- `npm run css:watch` - Watch and build CSS
- `npm run js:build` - Build JavaScript modules

## Deployment

### Prerequisites

1. Log in to Cloudflare:
   ```bash
   npx wrangler login
   ```

2. Configure your domain in Cloudflare DNS to point to your Worker

### Deploy

```bash
npm run deploy
```

This command will:
1. Build all assets (CSS, JS)
2. Deploy to Cloudflare Workers with minification

## Testing

Run the test suite:

```bash
npm test
```

Run with coverage:

```bash
npm run coverage
```

## How It Works

1. When a user runs `go get go.pixelfactory.io/pkg/server`, Go tooling makes an HTTP request with `?go-get=1`
2. The server responds with HTML containing meta tags that point to the actual repository
3. Go tooling uses this information to clone the correct repository
4. Regular browser requests show a user-friendly web interface listing all packages

## Project Structure

```
.
├── src/
│   ├── index.tsx          # Main application entry point
│   ├── config.ts          # Package configuration
│   ├── pages/             # Page components
│   ├── components/        # Reusable components
│   └── styles/            # Tailwind CSS
├── public/                # Static assets
├── test/                  # Test files
├── scripts/               # Build scripts
├── wrangler.toml         # Cloudflare Workers config
└── package.json          # Dependencies and scripts
```

## License

See [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
