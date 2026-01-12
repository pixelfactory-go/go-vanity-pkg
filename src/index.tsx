import { Hono } from "hono";
import { PkgPage } from "./pages/pkg";
import { PkgsPage } from './pages/pkgs'
import { config } from "./config";

type Bindings = {
  [key in keyof CloudflareBindings]: CloudflareBindings[key];
};

const app = new Hono<{ Bindings: Bindings }>();

// Loop through the packages and return the list of packages.
// Update url, godoc, and vcs if they are not defined.
const getPackages = () => {
  return config.pkgs.map((pkg) => {
    if (pkg.url === undefined) {
      pkg.url = config.url;
    }

    if (pkg.godoc === undefined) {
      pkg.godoc = config.godoc;
    }

    if (pkg.vcs === undefined) {
      pkg.vcs = "git";
    }

    if (pkg.modulePath === undefined) {
      pkg.modulePath = `${pkg.url}/${pkg.name}`;
    }

    if (pkg.docBadge === undefined) {
      pkg.docBadge = `//pkg.go.dev/badge/${pkg.modulePath}.svg`;
    }

    return pkg;
  });
};

const getPackage = (name: string) => {
  return getPackages().find((p) => p.name == name);
};

// Serve static files when running on Bun (CloudFlare Workers handles this via assets config)
// Must be before catch-all route
if (typeof Bun !== 'undefined') {
  app.get('/styles.css', async (c) => {
    const file = Bun.file('./styles.css')
    if (await file.exists()) {
      return new Response(file, {
        headers: { 'Content-Type': 'text/css' }
      })
    }
    return c.notFound()
  })

  app.get('/theme-toggle.js', async (c) => {
    const file = Bun.file('./public/theme-toggle.js')
    if (await file.exists()) {
      return new Response(file, {
        headers: { 'Content-Type': 'application/javascript' }
      })
    }
    return c.notFound()
  })

  app.get('/public/*', async (c) => {
    const path = c.req.path.replace(/^\//, '')
    const file = Bun.file(`./${path}`)
    if (await file.exists()) {
      return new Response(file)
    }
    return c.notFound()
  })
}

app.get('/', (c) => {
  const packages = getPackages()
  return c.html(<PkgsPage pkgs={packages} />)
})

app.get("/:name{.+}", (c) => {
  const name = c.req.param("name");

  const pkg = getPackage(name);
  if (pkg === undefined) {
    return c.text("404, package not found!", 404);
  }

  return c.html(<PkgPage pkg={pkg} />);
});

export default app;
