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
