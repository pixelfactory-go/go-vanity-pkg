import defaultConfig from '../config.json';

export type Pkg = {
  name: string;
  repo: string;
  godoc?: string;
  docBadge?: string;
  url?: string;
  vcs?: string;
  modulePath?: string;
  description?: string;
};

export type Config = {
  godoc: string;
  url: string;
  pkgs: Pkg[];
};

// Load configuration
const loadConfig = (): Config => {
  // If CONFIG_PATH is set, load custom config (Docker with custom config)
  if (process.env.CONFIG_PATH) {
    try {
      const { readFileSync } = require('fs');
      const fileContents = readFileSync(process.env.CONFIG_PATH, 'utf8');
      return JSON.parse(fileContents);
    } catch (err) {
      throw new Error(`Failed to load config from ${process.env.CONFIG_PATH}: ${err}`);
    }
  }

  // Use bundled config.json (works for both Workers and Docker)
  return defaultConfig as Config;
};

export const config: Config = loadConfig();
