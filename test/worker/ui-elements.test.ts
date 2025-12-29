import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";
import { describe, it, expect } from "vitest";
import worker from "../../src";

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
