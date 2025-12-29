import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
  SELF,
} from "cloudflare:test";
import { describe, it, expect } from "vitest";
import worker from "../src";
import { config } from "../src/config";

describe("Go Vanity Pkg Worker", () => {
  describe("Package List Page", () => {
    it("responds with HTML containing Tailwind classes", async () => {
      const request = new Request("https://go.pixelfactory.io/");
      const ctx = createExecutionContext();
      const response = await worker.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      const html = await response.text();

      // Check for Tailwind CSS link
      expect(html).toContain('<link rel="stylesheet" href="/styles.css"');

      // Check for dark mode script
      expect(html).toContain("prefers-color-scheme: dark");

      // Check for responsive layout classes
      expect(html).toContain("md:hidden"); // Mobile layout
      expect(html).toContain("hidden md:block"); // Desktop layout

      // Check for gradient classes
      expect(html).toContain("bg-gradient-to-r");
    });

    it("displays all configured packages", async () => {
      const request = new Request("https://go.pixelfactory.io/");
      const ctx = createExecutionContext();
      const response = await worker.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      const html = await response.text();

      // Check each package is displayed
      config.pkgs.forEach((pkg) => {
        expect(html).toContain(`${config.url}/${pkg.name}`);
        expect(html).toContain(pkg.repo);
      });
    });

    it("includes responsive mobile card layout", async () => {
      const request = new Request("https://go.pixelfactory.io/");
      const ctx = createExecutionContext();
      const response = await worker.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      const html = await response.text();

      // Check for mobile card classes
      expect(html).toContain("grid gap-4 md:hidden");
      expect(html).toContain("border-l-4 border-l-blue-500");
    });

    it("includes responsive desktop table layout", async () => {
      const request = new Request("https://go.pixelfactory.io/");
      const ctx = createExecutionContext();
      const response = await worker.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      const html = await response.text();

      // Check for desktop table
      expect(html).toContain("hidden md:block");
      expect(html).toContain("<table");
      expect(html).toContain("Package");
      expect(html).toContain("Source");
      expect(html).toContain("Documentation");
    });

    it("includes color-coded links", async () => {
      const request = new Request("https://go.pixelfactory.io/");
      const ctx = createExecutionContext();
      const response = await worker.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      const html = await response.text();

      // Check for purple GitHub links
      expect(html).toContain("text-purple-600");
      expect(html).toContain("hover:text-purple-400");

      // Check for teal docs links
      expect(html).toContain("text-teal-600");
      expect(html).toContain("dark:text-teal-400");
    });
  });

  describe("Individual Package Pages", () => {
    it("responds with Go Import meta tags for pkg/version", async () => {
      const request = new Request("https://go.pixelfactory.io/pkg/version");
      const ctx = createExecutionContext();
      const response = await worker.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      expect(await response.text()).toMatchInlineSnapshot(`
        "<!DOCTYPE html>
          <html>
            <head>
              <meta name="go-import" content="go.pixelfactory.io/pkg/version git https://github.com/pixelfactory-go/version">
              <meta name="go-source" content="go.pixelfactory.io/pkg/version https://github.com/pixelfactory-go/version https://github.com/pixelfactory-go/version/tree/master{/dir} https://github.com/pixelfactory-go/version/tree/master{/dir}/{file}#L{line}">
              <meta http-equiv="refresh" content="0; url=https://pkg.go.dev/go.pixelfactory.io/pkg/version">
            </head>
          <body>
            Nothing to see here. Please go to<a href="https://pkg.go.dev/go.pixelfactory.io/pkg/version"></a>.
          </body>
          </html>
          "
      `);
    });

    it("responds with correct meta tags for all packages", async () => {
      for (const pkg of config.pkgs) {
        const request = new Request(`https://go.pixelfactory.io/${pkg.name}`);
        const ctx = createExecutionContext();
        const response = await worker.fetch(request, env, ctx);
        await waitOnExecutionContext(ctx);

        const html = await response.text();
        const modulePath = `${config.url}/${pkg.name}`;

        // Check go-import meta tag
        expect(html).toContain(
          `<meta name="go-import" content="${modulePath} git https://${pkg.repo}">`
        );

        // Check go-source meta tag
        expect(html).toContain(
          `<meta name="go-source" content="${modulePath} https://${pkg.repo}`
        );

        // Check redirect
        expect(html).toContain(
          `<meta http-equiv="refresh" content="0; url=https://${config.godoc}/${modulePath}">`
        );
      }
    });

    it("returns 404 for non-existent package", async () => {
      const request = new Request("https://go.pixelfactory.io/pkg/nonexistent");
      const ctx = createExecutionContext();
      const response = await worker.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(404);
      expect(await response.text()).toContain("404, package not found!");
    });
  });

  describe("SVG Icons", () => {
    it("includes Package icon SVG", async () => {
      const request = new Request("https://go.pixelfactory.io/");
      const ctx = createExecutionContext();
      const response = await worker.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      const html = await response.text();

      // Check for SVG elements
      expect(html).toContain("<svg");
      expect(html).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(html).toContain('stroke="currentColor"');
    });
  });

  describe("Dark Mode", () => {
    it("includes dark mode color variants", async () => {
      const request = new Request("https://go.pixelfactory.io/");
      const ctx = createExecutionContext();
      const response = await worker.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      const html = await response.text();

      // Check for dark mode classes
      expect(html).toContain("dark:text-blue-400");
      expect(html).toContain("dark:from-blue-950");
      expect(html).toContain("dark:hover:text-purple-400");
    });

    it("includes system preference detection script", async () => {
      const request = new Request("https://go.pixelfactory.io/");
      const ctx = createExecutionContext();
      const response = await worker.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      const html = await response.text();

      expect(html).toContain(
        "window.matchMedia('(prefers-color-scheme: dark)')"
      );
      expect(html).toContain("document.documentElement.classList.add('dark')");
    });
  });
});
