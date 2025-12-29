import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";
import { describe, it, expect } from "vitest";
import worker from "../../src";
import { config } from "../../src/config";

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
