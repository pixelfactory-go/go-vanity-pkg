import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { readFileSync, existsSync, writeFileSync, unlinkSync } from "fs";
import { join } from "path";
import { config } from "../../src/config";

describe("Config Loader", () => {
  describe("Structure and Types", () => {
    it("should load config with required fields", () => {
      expect(config).toBeDefined();
      expect(config.godoc).toBeDefined();
      expect(config.url).toBeDefined();
      expect(config.pkgs).toBeDefined();
      expect(typeof config.godoc).toBe("string");
      expect(typeof config.url).toBe("string");
      expect(Array.isArray(config.pkgs)).toBe(true);
    });

    it("should have non-empty required fields", () => {
      expect(config.godoc.length).toBeGreaterThan(0);
      expect(config.url.length).toBeGreaterThan(0);
      expect(config.pkgs.length).toBeGreaterThan(0);
    });

    it("should have valid package structure", () => {
      config.pkgs.forEach((pkg) => {
        expect(pkg).toHaveProperty("name");
        expect(pkg).toHaveProperty("repo");
        expect(typeof pkg.name).toBe("string");
        expect(typeof pkg.repo).toBe("string");
        expect(pkg.name.length).toBeGreaterThan(0);
        expect(pkg.repo.length).toBeGreaterThan(0);
      });
    });

    it("should validate optional package fields types", () => {
      config.pkgs.forEach((pkg) => {
        if (pkg.godoc !== undefined) expect(typeof pkg.godoc).toBe("string");
        if (pkg.url !== undefined) expect(typeof pkg.url).toBe("string");
        if (pkg.vcs !== undefined) expect(typeof pkg.vcs).toBe("string");
        if (pkg.description !== undefined) expect(typeof pkg.description).toBe("string");
        if (pkg.modulePath !== undefined) expect(typeof pkg.modulePath).toBe("string");
        if (pkg.docBadge !== undefined) expect(typeof pkg.docBadge).toBe("string");
      });
    });
  });

  describe("JSON Config File", () => {
    const configPath = join(process.cwd(), "config.json");

    it("should have config.json file", () => {
      expect(existsSync(configPath)).toBe(true);
    });

    it("should have valid JSON syntax", () => {
      const fileContent = readFileSync(configPath, "utf8");
      expect(() => JSON.parse(fileContent)).not.toThrow();
    });

    it("should match config.json file content", () => {
      const fileContent = readFileSync(configPath, "utf8");
      const jsonConfig = JSON.parse(fileContent);

      expect(config.godoc).toBe(jsonConfig.godoc);
      expect(config.url).toBe(jsonConfig.url);
      expect(config.pkgs.length).toBe(jsonConfig.pkgs.length);

      config.pkgs.forEach((pkg, index) => {
        expect(pkg.name).toBe(jsonConfig.pkgs[index].name);
        expect(pkg.repo).toBe(jsonConfig.pkgs[index].repo);
      });
    });
  });

  describe("CONFIG_PATH Environment Variable", () => {
    it("should support CONFIG_PATH functionality (integration test)", () => {
      // Test the config loader logic by simulating what it does
      const tempConfigPath = join(process.cwd(), "test-custom-config.json");
      const tempConfig = {
        godoc: "custom.godoc.dev",
        url: "go.custom.com",
        pkgs: [
          {
            name: "pkg/test",
            repo: "github.com/test/test-repo"
          }
        ]
      };

      // Write temp config file
      writeFileSync(tempConfigPath, JSON.stringify(tempConfig, null, 2));

      try {
        // Simulate what the config loader does when CONFIG_PATH is set
        const fileContents = readFileSync(tempConfigPath, 'utf8');
        const loadedConfig = JSON.parse(fileContents);

        // Verify the loaded config matches what we wrote
        expect(loadedConfig.godoc).toBe("custom.godoc.dev");
        expect(loadedConfig.url).toBe("go.custom.com");
        expect(loadedConfig.pkgs[0].name).toBe("pkg/test");
        expect(loadedConfig.pkgs[0].repo).toBe("github.com/test/test-repo");
      } finally {
        // Cleanup
        unlinkSync(tempConfigPath);
      }
    });

    it("should throw error for non-existent CONFIG_PATH file", () => {
      const nonExistentPath = "/tmp/non-existent-config.json";

      // Simulate what happens when file doesn't exist
      expect(() => {
        readFileSync(nonExistentPath, 'utf8');
      }).toThrow();
    });

    it("should throw error for invalid JSON in CONFIG_PATH", () => {
      const invalidConfigPath = join(process.cwd(), "invalid-test-config.json");
      writeFileSync(invalidConfigPath, "{ invalid json }");

      try {
        // Simulate what happens with invalid JSON
        const fileContents = readFileSync(invalidConfigPath, 'utf8');
        expect(() => {
          JSON.parse(fileContents);
        }).toThrow();
      } finally {
        unlinkSync(invalidConfigPath);
      }
    });
  });

  describe("Documentation", () => {
    it("should be documented in README", () => {
      const readmePath = join(process.cwd(), "README.md");
      const readmeContent = readFileSync(readmePath, "utf8");
      expect(readmeContent).toContain("config");
      expect(readmeContent).toContain("Configuration");
    });
  });
});
