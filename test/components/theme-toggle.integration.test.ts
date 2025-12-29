import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { initTheme, toggleTheme } from "../../src/components/theme-toggle";

describe("Theme Toggle - Integration Tests", () => {
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
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("toggleTheme", () => {
    it("switches from light to dark theme", () => {
      expect(document.documentElement.classList.contains("dark")).toBe(false);
      toggleTheme();
      expect(document.documentElement.classList.contains("dark")).toBe(true);
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "theme-preference",
        "dark"
      );
    });

    it("switches from dark to light theme", () => {
      document.documentElement.classList.add("dark");
      toggleTheme();
      expect(document.documentElement.classList.contains("dark")).toBe(false);
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "theme-preference",
        "light"
      );
    });

    it("updates ARIA label when toggling", () => {
      const button = document.getElementById("theme-toggle");
      toggleTheme(); // light -> dark
      expect(button?.getAttribute("aria-label")).toBe("Switch to light mode");

      toggleTheme(); // dark -> light
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

      expect(() => toggleTheme()).not.toThrow();
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
  });

  describe("Full User Flow", () => {
    it("complete user flow: init -> toggle -> reload", () => {
      // Initial load with no preference (defaults to light)
      initTheme();
      expect(document.documentElement.classList.contains("dark")).toBe(false);

      // User clicks toggle (light -> dark)
      toggleTheme();
      expect(document.documentElement.classList.contains("dark")).toBe(true);
      expect(localStorageMock["theme-preference"]).toBe("dark");

      // Simulate page reload - should remember dark theme
      document.documentElement.className = ""; // Reset
      initTheme();
      expect(document.documentElement.classList.contains("dark")).toBe(true);

      // User clicks toggle again (dark -> light)
      toggleTheme();
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

      initTheme();
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
  });
});
