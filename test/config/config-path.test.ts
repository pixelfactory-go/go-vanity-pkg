import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { writeFileSync, unlinkSync } from "fs";
import { join } from "path";

// This test file specifically tests CONFIG_PATH functionality
// by setting the environment variable before the config module is loaded

describe("Config Loader with CONFIG_PATH", () => {
  const testConfigPath = join(process.cwd(), "test-config-path.json");
  const testConfig = {
    godoc: "test.godoc.dev",
    url: "go.test.com",
    pkgs: [
      {
        name: "pkg/custom",
        repo: "github.com/test/custom-repo"
      }
    ]
  };

  beforeAll(() => {
    // Create test config file before importing the config module
    writeFileSync(testConfigPath, JSON.stringify(testConfig, null, 2));
    process.env.CONFIG_PATH = testConfigPath;
  });

  afterAll(() => {
    // Cleanup
    delete process.env.CONFIG_PATH;
    try {
      unlinkSync(testConfigPath);
    } catch (e) {
      // Ignore cleanup errors
    }
  });

  it("should load config from CONFIG_PATH when environment variable is set", async () => {
    // Import the config module - it will use CONFIG_PATH
    const { config } = await import("../../src/config");

    expect(config).toBeDefined();
    expect(config.godoc).toBe("test.godoc.dev");
    expect(config.url).toBe("go.test.com");
    expect(config.pkgs).toHaveLength(1);
    expect(config.pkgs[0].name).toBe("pkg/custom");
    expect(config.pkgs[0].repo).toBe("github.com/test/custom-repo");
  });
});
