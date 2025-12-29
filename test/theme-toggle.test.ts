import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

// Read the theme-toggle.js script
const themeToggleScript = readFileSync(
  join(__dirname, "../public/theme-toggle.js"),
  "utf-8"
);

describe("Theme Toggle Script", () => {
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = `
      <button id="theme-toggle" aria-label="Toggle theme"></button>
    `;
    document.documentElement.className = "";

    // Mock localStorage
    localStorageMock = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn((key: string) => localStorageMock[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          localStorageMock[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
          delete localStorageMock[key];
        }),
        clear: vi.fn(() => {
          localStorageMock = {};
        }),
      },
      writable: true,
      configurable: true,
    });

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      value: vi.fn((query: string) => ({
        matches: false, // default to light mode
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
      writable: true,
      configurable: true,
    });

    // Mark as Vitest environment to expose test-only functions
    (window as any).__VITEST__ = true;

    // Execute the theme-toggle.js script (without auto-init)
    const scriptWithoutAutoInit = themeToggleScript.replace(
      /\/\/ Initialize theme when script loads\s*\ninitTheme\(\)/,
      ""
    );
    eval(scriptWithoutAutoInit);
  });

  afterEach(() => {
    vi.clearAllMocks();
    delete (window as any).toggleTheme;
    delete (window as any).initTheme;
    delete (window as any).applyTheme;
    delete (window as any).updateToggleButton;
    delete (window as any).__VITEST__;
  });

  describe("applyTheme", () => {
    it("adds 'dark' class to documentElement when theme is dark", () => {
      (window as any).applyTheme("dark");
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("removes 'dark' class from documentElement when theme is light", () => {
      document.documentElement.classList.add("dark");
      (window as any).applyTheme("light");
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });
  });

  describe("updateToggleButton", () => {
    it("updates ARIA label to 'Switch to light mode' when theme is dark", () => {
      const button = document.getElementById("theme-toggle");
      (window as any).updateToggleButton("dark");
      expect(button?.getAttribute("aria-label")).toBe("Switch to light mode");
    });

    it("updates ARIA label to 'Switch to dark mode' when theme is light", () => {
      const button = document.getElementById("theme-toggle");
      (window as any).updateToggleButton("light");
      expect(button?.getAttribute("aria-label")).toBe("Switch to dark mode");
    });

    it("does nothing if button element not found", () => {
      document.body.innerHTML = ""; // Remove button
      expect(() => (window as any).updateToggleButton("dark")).not.toThrow();
    });
  });

  describe("initTheme", () => {
    it("uses saved theme from localStorage if available", () => {
      localStorageMock["theme-preference"] = "dark";
      (window as any).initTheme();
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("uses system preference if no saved theme", () => {
      Object.defineProperty(window, 'matchMedia', {
        value: vi.fn((query: string) => ({
          matches: query === "(prefers-color-scheme: dark)",
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
        writable: true,
        configurable: true,
      });

      (window as any).initTheme();
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("defaults to light theme if no preference and system prefers light", () => {
      (window as any).initTheme();
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    it("validates theme value from localStorage", () => {
      localStorageMock["theme-preference"] = "invalid-value";

      Object.defineProperty(window, 'matchMedia', {
        value: vi.fn((query: string) => ({
          matches: query === "(prefers-color-scheme: dark)",
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
        writable: true,
        configurable: true,
      });

      (window as any).initTheme();
      // Should fall back to system preference (dark in this case)
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("handles localStorage errors gracefully", () => {
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: vi.fn(() => {
            throw new Error("localStorage unavailable");
          }),
        },
        writable: true,
        configurable: true,
      });

      Object.defineProperty(window, 'matchMedia', {
        value: vi.fn((query: string) => ({
          matches: query === "(prefers-color-scheme: dark)",
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
        writable: true,
        configurable: true,
      });

      expect(() => (window as any).initTheme()).not.toThrow();
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
  });

  describe("toggleTheme", () => {
    it("switches from light to dark theme", () => {
      expect(document.documentElement.classList.contains("dark")).toBe(false);
      (window as any).toggleTheme();
      expect(document.documentElement.classList.contains("dark")).toBe(true);
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "theme-preference",
        "dark"
      );
    });

    it("switches from dark to light theme", () => {
      document.documentElement.classList.add("dark");
      (window as any).toggleTheme();
      expect(document.documentElement.classList.contains("dark")).toBe(false);
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "theme-preference",
        "light"
      );
    });

    it("updates ARIA label when toggling", () => {
      const button = document.getElementById("theme-toggle");
      (window as any).toggleTheme(); // light -> dark
      expect(button?.getAttribute("aria-label")).toBe("Switch to light mode");

      (window as any).toggleTheme(); // dark -> light
      expect(button?.getAttribute("aria-label")).toBe("Switch to dark mode");
    });

    it("handles localStorage errors gracefully", () => {
      Object.defineProperty(window, 'localStorage', {
        value: {
          setItem: vi.fn(() => {
            throw new Error("localStorage quota exceeded");
          }),
        },
        writable: true,
        configurable: true,
      });

      expect(() => (window as any).toggleTheme()).not.toThrow();
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
  });

  describe("Integration", () => {
    it("complete user flow: init -> toggle -> reload", () => {
      // Initial load with no preference (defaults to light)
      (window as any).initTheme();
      expect(document.documentElement.classList.contains("dark")).toBe(false);

      // User clicks toggle (light -> dark)
      (window as any).toggleTheme();
      expect(document.documentElement.classList.contains("dark")).toBe(true);
      expect(localStorageMock["theme-preference"]).toBe("dark");

      // Simulate page reload - should remember dark theme
      document.documentElement.className = ""; // Reset
      (window as any).initTheme();
      expect(document.documentElement.classList.contains("dark")).toBe(true);

      // User clicks toggle again (dark -> light)
      (window as any).toggleTheme();
      expect(document.documentElement.classList.contains("dark")).toBe(false);
      expect(localStorageMock["theme-preference"]).toBe("light");
    });

    it("respects system preference when no saved preference exists", () => {
      Object.defineProperty(window, 'matchMedia', {
        value: vi.fn((query: string) => ({
          matches: query === "(prefers-color-scheme: dark)",
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
        writable: true,
        configurable: true,
      });

      (window as any).initTheme();
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
  });
});
