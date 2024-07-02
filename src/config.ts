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

export const config: Config = {
  godoc: "pkg.go.dev",
  url: "go.pixelfactory.io",
  pkgs: [
    {
      name: "pkg/observability/log",
      repo: "github.com/pixelfactory-go/observability-log",
    },
    {
      name: "pkg/observability/trace",
      repo: "github.com/pixelfactory-go/observability-trace",
    },
    {
      name: "pkg/server",
      repo: "github.com/pixelfactory-go/server",
    },
    {
      name: "pkg/version",
      repo: "github.com/pixelfactory-go/version",
    },
  ],
};
