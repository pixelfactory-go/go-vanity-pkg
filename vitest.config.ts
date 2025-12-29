import { defineConfig } from "vitest/config";
import { defineWorkersProject } from "@cloudflare/vitest-pool-workers/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "istanbul",
      reporter: ["json", "html"],
      include: ["src/**/*.{ts,tsx}", "public/**/*.js"],
    },
    projects: [
      defineWorkersProject({
        test: {
          name: "workers",
          include: ["test/index.test.ts"],
          poolOptions: {
            workers: {
              wrangler: { configPath: "./wrangler.toml" },
            },
          },
        },
      }),
      {
        test: {
          name: "browser",
          include: ["test/theme-toggle.test.ts"],
          environment: "happy-dom",
        },
      },
    ],
  },
});
