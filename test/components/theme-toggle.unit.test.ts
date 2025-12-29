import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { applyTheme, updateToggleButton } from "../../src/components/theme-toggle";

describe("Theme Toggle - Unit Tests", () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = `
      <button id="theme-toggle" aria-label="Toggle theme"></button>
    `;
    document.documentElement.className = "";
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("applyTheme", () => {
    it("adds 'dark' class to documentElement when theme is dark", () => {
      applyTheme("dark");
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("removes 'dark' class from documentElement when theme is light", () => {
      document.documentElement.classList.add("dark");
      applyTheme("light");
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });
  });

  describe("updateToggleButton", () => {
    it("updates ARIA label to 'Switch to light mode' when theme is dark", () => {
      const button = document.getElementById("theme-toggle");
      updateToggleButton("dark");
      expect(button?.getAttribute("aria-label")).toBe("Switch to light mode");
    });

    it("updates ARIA label to 'Switch to dark mode' when theme is light", () => {
      const button = document.getElementById("theme-toggle");
      updateToggleButton("light");
      expect(button?.getAttribute("aria-label")).toBe("Switch to dark mode");
    });

    it("does nothing if button element not found", () => {
      document.body.innerHTML = ""; // Remove button
      expect(() => updateToggleButton("dark")).not.toThrow();
    });
  });
});
