import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src';

describe('Go Vanity Pkg Worker', () => {
	it('responds with Go Import meta tags', async () => {
		const request = new Request('https://go.pixelfactory.io/pkg/version');
		// Create an empty context to pass to `worker.fetch()`.
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
		await waitOnExecutionContext(ctx);
		expect(await response.text()).toMatchInlineSnapshot(`
			"<!DOCTYPE html>
			<html>
			<head>
			<meta name="go-import" content="go.pixelfactory.io/pkg/version git https://github.com/pixelfactory-go/version">
			<meta name="go-source" content="go.pixelfactory.io/pkg/version https://github.com/pixelfactory-go/version https://github.com/pixelfactory-go/version/tree/master{/dir} https://github.com/pixelfactory-go/version/tree/master{/dir}/{file}#L{line}">
			<meta http-equiv="refresh" content="0; url=https://pkg.go.dev/go.pixelfactory.io/pkg/version">
			</head>
			<body>
			Nothing to see here. Please go to<a href="https://pkg.go.dev/go.pixelfactory.io/pkg/version"></a>.
			</body>
			</html>"
		`);
	});
});
