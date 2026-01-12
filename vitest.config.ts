import { defineConfig } from "vitest/config";
import { defineWorkersProject } from "@cloudflare/vitest-pool-workers/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "istanbul",
      reporter: ["json", "html", "cobertura"],
      include: ["src/**/*.{ts,tsx}"],
    },
    projects: [
      defineWorkersProject({
        test: {
          name: "workers",
          include: ["test/worker/**/*.test.ts"],
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
          include: ["test/components/**/*.test.ts"],
          environment: "happy-dom",
        },
      },
    ],
  },
});
