import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { initTheme } from "../../src/components/theme-toggle";

describe("Theme Toggle - Init Tests", () => {
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

  describe("initTheme", () => {
    it("uses saved theme from localStorage if available", () => {
      localStorageMock["theme-preference"] = "dark";
      initTheme();
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

      initTheme();
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("defaults to light theme if no preference and system prefers light", () => {
      initTheme();
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

      initTheme();
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

      expect(() => initTheme()).not.toThrow();
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
  });
});
