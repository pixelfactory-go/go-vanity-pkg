# Go Vanity Package Server

A lightweight Go vanity import path server built with [Hono](https://hono.dev/) and deployed on [Cloudflare Workers](https://workers.cloudflare.com/).

## What is a Vanity Import Path?

Vanity import paths allow you to use custom domain names for your Go packages instead of hosting provider URLs. For example, instead of:

```go
import "github.com/pixelfactory-go/observability-log"
```

You can use:

```go
import "go.pixelfactory.io/pkg/observability/log"
```

This server handles the redirects and meta tags necessary for Go tooling to resolve your custom import paths.

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

Edit `src/config.ts` to configure your packages:

```typescript
export const config: Config = {
  godoc: "pkg.go.dev",
  url: "go.pixelfactory.io",  // Your vanity domain
  pkgs: [
    {
      name: "pkg/observability/log",
      repo: "github.com/pixelfactory-go/observability-log",
    },
    // Add more packages...
  ],
};
```

### Package Configuration Options

- `name`: The path segment after your domain (e.g., `pkg/server`)
- `repo`: The actual repository URL (e.g., `github.com/user/repo`)
- `godoc` (optional): Custom godoc URL (defaults to config.godoc)
- `url` (optional): Custom domain (defaults to config.url)
- `vcs` (optional): Version control system (defaults to "git")
- `description` (optional): Package description
- `modulePath` (optional): Full module path (auto-generated if not provided)
- `docBadge` (optional): Documentation badge URL (auto-generated if not provided)

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
