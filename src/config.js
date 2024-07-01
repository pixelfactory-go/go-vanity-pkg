const config = {
  godoc: "pkg.go.dev",
  url: "go.pixelfactory.io",
  packages: {
    'pkg/observability/log': {
      repo: "github.com/pixelfactory-go/observability-log",
    },
    'pkg/observability/trace': {
      repo: "github.com/pixelfactory-go/observability-trace"
    },
    'pkg/server': {
      repo: "github.com/pixelfactory-go/server"
    },
    'pkg/version': {
      repo: "github.com/pixelfactory-go/version"
    }
  }
}


export default config