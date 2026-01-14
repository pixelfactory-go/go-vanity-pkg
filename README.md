# Go Vanity Package Server

> **Self-host Go vanity imports on Cloudflare Workers for free**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://hub.docker.com/)
[![Bun](https://img.shields.io/badge/Runtime-Bun-000000?logo=bun&logoColor=white)](https://bun.sh/)

A lightweight Go vanity import path server built with [Hono](https://hono.dev/) that supports both [Cloudflare Workers](https://workers.cloudflare.com/) and container-based deployments.

Transform `github.com/yourorg/really-long-repo-name` into clean imports like `go.yourdomain.com/pkg` — while maintaining full control over your packages and paying nothing for hosting on Cloudflare's free tier.

## Table of Contents

- [Features](#features)
- [Why This Project?](#why-this-project)
  - [Free & Fast](#free--fast)
  - [Simple Configuration](#simple-configuration)
  - [Production-Ready Features](#production-ready-features)
  - [Real-World Usage](#real-world-usage)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
  - [Setting Up Your Vanity Domain](#setting-up-your-vanity-domain)
  - [Package Configuration](#package-configuration)
  - [Deployment Configuration](#deployment-configuration)
- [Development](#development)
- [Deployment](#deployment)
  - [Cloudflare Workers (Edge Deployment)](#option-1-cloudflare-workers-edge-deployment)
  - [Docker (Container Deployment)](#option-2-docker-container-deployment)
- [Testing](#testing)
- [How It Works](#how-it-works)
- [Project Structure](#project-structure)
- [License](#license)
- [Contributing](#contributing)

## Features

- Custom Go vanity import paths with automatic pkg.go.dev integration
- Responsive web interface listing all packages
- Dark/light theme support with localStorage persistence
- Built with Hono for edge performance
- Multiple deployment options:
  - Cloudflare Workers for global edge distribution
  - Docker containers for self-hosted deployments
- Tailwind CSS styling

## Why This Project?

### Free & Fast
Unlike self-hosted solutions that require a VPS or alternatives that need paid infrastructure, **go-vanity-pkg runs on Cloudflare Workers' free tier** (100,000 requests/day). Deploy globally across 300+ edge locations with zero hosting costs and sub-50ms response times worldwide.

### Simple Configuration
Just a single `config.json` file — no database, no complex setup. Compare to alternatives:

| Solution | Setup Complexity | Hosting Cost | Performance |
|----------|------------------|--------------|-------------|
| **go-vanity-pkg** | Single JSON file | $0 (CF free tier) | Global edge (< 50ms) |
| nginx + VPS | nginx config, server management | ~$5-20/month | Single region |
| uber-go/sally | host setup | VPS required | Depends on hosting |
| Google Cloud Run | Container + Cloud config | Pay per request | Regional |

### Production-Ready Features
- **Beautiful web UI** with dark/light theme for browsing your packages
- **Flexible deployment** — Cloudflare Workers for edge hosting OR Docker for self-hosted control
- **TypeScript-first** — full type safety with modern tooling (Hono + Bun)

### Real-World Usage

This project powers package imports for several Go projects in production:

```go
// Instead of:
import "github.com/pixelfactory-go/some-internal-package"

// Use clean imports:
import "go.pixelfactory.io/pkg/server"
import "go.pixelfactory.io/pkg/logger"
```

**Benefits:**
- **Brand consistency** — All your packages under your domain
- **Migration flexibility** — Move repos without breaking imports (change config, not code)
- **Clean appearance** — Clean import paths for public APIs
- **Zero downtime** — Global edge distribution with automatic failover

## Prerequisites

**Development:**
- [Bun](https://bun.sh/) v1.0 or later - 3x faster, native TypeScript support

**Deployment:**
- **Cloudflare Workers**: Cloudflare account and Wrangler CLI
- **Docker**: Docker and Docker Compose (optional)

## Quick Start

Get up and running in under 2 minutes:

```bash
# 1. Clone and install
git clone https://github.com/pixelfactory-go/go-vanity-pkg.git
cd go-vanity-pkg
bun install

# 2. Configure your packages
cp config.example.json config.json
# Edit config.json with your domain and packages

# 3. Deploy to Cloudflare Workers (free tier)
bunx wrangler login
bun run deploy
```

That's it! Your vanity imports are now live on Cloudflare's global edge network.

## Installation

```bash
bun install
```

## Configuration

### Setting Up Your Vanity Domain

1. **Configure your domain** in `config.json`:

```json
{
  "godoc": "pkg.go.dev",
  "url": "go.yourdomain.com",
  "pkgs": [
    {
      "name": "pkg/server",
      "repo": "github.com/yourorg/server"
    },
    {
      "name": "pkg/logger",
      "repo": "github.com/yourorg/logger"
    }
  ]
}
```

2. **DNS Configuration**: Point your domain to your Cloudflare Worker
   - Add a DNS record (A, AAAA, or CNAME) for your vanity domain
   - Configure it as a route in your Cloudflare Worker settings

3. **Update wrangler.toml** if needed to add custom routes or domains

### Package Configuration

The configuration is loaded from `config.json` in the project root. This JSON file is:
- **Bundled at build time** for Cloudflare Workers (via direct JSON import)
- **Loaded at runtime** in Docker containers (with optional CONFIG_PATH override)

Each package in the `pkgs` array supports the following options:

#### Required Fields
- `name`: Path segment after your domain
  - Example: `"pkg/server"` creates `go.yourdomain.com/pkg/server`
- `repo`: Actual repository location
  - Example: `"github.com/yourorg/server"`

#### Optional Fields
- `url`: Override the global vanity domain for this package
  - Default: Uses the global `url` value
- `godoc`: Override the documentation host
  - Default: Uses the global `godoc` value (typically "pkg.go.dev")
- `vcs`: Version control system
  - Default: `"git"`
  - Options: `"git"`, `"hg"`, `"svn"`, `"bzr"`
- `description`: Package description displayed on the web interface
- `modulePath`: Full import path
  - Default: Auto-generated as `${url}/${name}`
- `docBadge`: Documentation badge URL
  - Default: Auto-generated as `//pkg.go.dev/badge/${modulePath}.svg`

### Configuration Example

```json
{
  "godoc": "pkg.go.dev",
  "url": "go.example.com",
  "pkgs": [
    {
      "name": "pkg/http",
      "repo": "github.com/example/http-server",
      "description": "HTTP server utilities"
    },
    {
      "name": "tools/cli",
      "repo": "github.com/example/cli-tools",
      "vcs": "git",
      "description": "Command-line tools"
    }
  ]
}
```

This configuration allows users to import packages as:
```go
import "go.example.com/pkg/http"
import "go.example.com/tools/cli"
```

### Deployment Configuration

#### Cloudflare Workers
The configuration in `config.json` is automatically bundled at build/deploy time. Simply edit `config.json` and run:
```bash
bun run deploy
```

#### Docker Deployment

**Important:** The pre-built Docker images contain only a placeholder config. You **must** provide your own `config.json` file.

**Option 1: Use pre-built image with custom config** (Recommended)
```bash
# Create your custom config file
cat > my-config.json << 'EOF'
{
  "godoc": "pkg.go.dev",
  "url": "go.yourdomain.com",
  "pkgs": [
    {
      "name": "pkg/server",
      "repo": "github.com/yourorg/server"
    }
  ]
}
EOF

# Run with CONFIG_PATH environment variable
docker run -d \
  -p 3000:3000 \
  -e CONFIG_PATH=/config/config.json \
  -v $(pwd)/my-config.json:/config/config.json:ro \
  ghcr.io/pixelfactory-go/go-vanity-pkg:latest
```

**Option 2: Build custom image**
```bash
# Copy the example config and edit it
cp config.example.json config.json
# Edit config.json with your settings
vim config.json

# Build the image
docker build -t my-vanity-pkg .
docker run -d -p 3000:3000 my-vanity-pkg
```

**Note:** The Dockerfile copies `config.example.json` as the default config to prevent leaking the repository's internal configuration.

## Development

### Local Development (Bun - Recommended)

Start the development server with hot reload using Bun:

```bash
bun run dev
```

This will:
1. Build CSS from Tailwind
2. Build JavaScript theme toggle
3. Start Bun development server with hot reload
4. Enable native TypeScript execution

The server will be available at `http://localhost:3000`

**Why Bun?**
- 📦 Native TypeScript support (no compilation needed)
- 🔥 Built-in hot reload
- 💾 Smaller memory footprint
- ✅ Drop-in replacement for Node.js/npm

### Cloudflare Workers Development

To test with the CloudFlare Workers runtime:

```bash
bun run dev:cf
```

The server will be available at `http://localhost:8787`

This uses Wrangler to simulate the CloudFlare Workers environment locally.

### Available Scripts

**Primary (Bun):**
- `bun run dev` - Start Bun development server with hot reload (fastest)
- `bun start` - Start production server
- `bun run deploy` - Deploy to Cloudflare Workers
- `bun test` - Run tests
- `bun run coverage` - Run tests with coverage

**CloudFlare Workers:**
- `bun run dev:cf` - Start Cloudflare Workers dev server
- `bun run deploy` - Deploy to Cloudflare Workers
- `bun run cf-typegen` - Generate TypeScript types (run after changing wrangler.toml)

**Build:**
- `bun run build` - Build the project
- `bun run css:build` - Build CSS from Tailwind
- `bun run css:watch` - Watch and build CSS
- `bun run js:build` - Build JavaScript modules

## Deployment

### Option 1: Cloudflare Workers (Edge Deployment)

Deploy to CloudFlare's global edge network for ultra-low latency worldwide.

#### Prerequisites

1. Log in to Cloudflare:
   ```bash
   bunx wrangler login
   ```

2. Configure your domain in Cloudflare DNS to point to your Worker

#### Deploy

```bash
bun run deploy
```

This command will:
1. Build all assets (CSS, JS) using Bun
2. Deploy to Cloudflare Workers with minification
3. Distribute globally across 300+ edge locations

**Note:** CloudFlare Workers run on their own V8 runtime. Wrangler bundles your code and deploys it - the local runtime (Bun/Node) doesn't affect CloudFlare Workers deployment.

### Option 2: Docker (Container Deployment)

Docker images use [Bun](https://bun.sh/) runtime for optimal performance:
- **Native TypeScript support** - No compilation or transpilation needed
- **3x faster** than Node.js for most workloads
- **Smaller image size** - ~90MB vs ~180MB with Node.js
- **Drop-in replacement** - Works with existing Hono/Node.js code

#### Using Pre-built Images

Pre-built Docker images are automatically published to GitHub Container Registry on every release:

```bash
docker pull ghcr.io/pixelfactory-go/go-vanity-pkg:latest
docker run -d -p 3000:3000 ghcr.io/pixelfactory-go/go-vanity-pkg:latest
```

Available tags:
- `latest` - Latest stable release
- `main` - Latest commit on main branch
- `v*` - Specific version tags (e.g., `v1.0.0`)
- `sha-*` - Specific commit SHA

#### Using Docker Compose (Recommended)

1. **Build and start the container**:
   ```bash
   docker-compose up -d
   ```

2. **View logs**:
   ```bash
   docker-compose logs -f
   ```

3. **Stop the container**:
   ```bash
   docker-compose down
   ```

The server will be available at `http://localhost:3000` by default. You can customize the port by setting the `PORT` environment variable:

```bash
PORT=8080 docker-compose up -d
```

#### Using Docker CLI

1. **Build the image**:
   ```bash
   docker build -t go-vanity-pkg .
   ```

2. **Run the container**:
   ```bash
   docker run -d \
     --name go-vanity-pkg \
     -p 3000:3000 \
     -e NODE_ENV=production \
     go-vanity-pkg:latest
   ```

3. **View logs**:
   ```bash
   docker logs -f go-vanity-pkg
   ```

4. **Stop the container**:
   ```bash
   docker stop go-vanity-pkg
   docker rm go-vanity-pkg
   ```

#### Production Docker Deployment

For production deployments, you can:

1. **Push to a container registry**:
   ```bash
   docker tag go-vanity-pkg:latest your-registry.com/go-vanity-pkg:latest
   docker push your-registry.com/go-vanity-pkg:latest
   ```

2. **Deploy to container orchestration platforms**:
   - Kubernetes
   - Docker Swarm
   - Amazon ECS
   - Google Cloud Run
   - Azure Container Instances

3. **Configure reverse proxy** (nginx, Caddy, Traefik) for:
   - SSL/TLS termination
   - Domain routing
   - Load balancing

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
│   ├── config.ts          # Configuration loader and type definitions
│   ├── pages/             # Page components
│   ├── components/        # Reusable components
│   └── styles/            # Tailwind CSS
├── public/                # Static assets
├── test/                  # Test files
├── scripts/               # Build scripts
├── config.json            # Package configuration (JSON)
├── config.example.json    # Example config (used in Docker builds)
├── wrangler.toml          # Cloudflare Workers config
└── package.json           # Dependencies and scripts
```

## License

See [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
