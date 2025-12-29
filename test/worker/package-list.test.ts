import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";
import { describe, it, expect } from "vitest";
import worker from "../../src";
import { config } from "../../src/config";

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
