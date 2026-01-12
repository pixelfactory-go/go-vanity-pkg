# Go Vanity Package Server

A lightweight Go vanity import path server built with [Hono](https://hono.dev/) that supports both [Cloudflare Workers](https://workers.cloudflare.com/) and container-based deployments.

## Features

- Custom Go vanity import paths with automatic pkg.go.dev integration
- Responsive web interface listing all packages
- Dark/light theme support with localStorage persistence
- Built with Hono for edge performance
- Multiple deployment options:
  - Cloudflare Workers for global edge distribution
  - Docker containers for self-hosted deployments
- Tailwind CSS styling

## Prerequisites

**Development:**
- [Bun](https://bun.sh/) v1.0 or later - 3x faster, native TypeScript support

**Deployment:**
- **Cloudflare Workers**: Cloudflare account and Wrangler CLI (included in dependencies, works with Bun)
- **Docker**: Docker and Docker Compose (optional)

## Installation

```bash
bun install
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
- 🚀 3x faster than Node.js
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
