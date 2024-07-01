import { Router } from 'itty-router'
import config from './config'

const router = Router()

router.get('/', () => {
	return new Response('Welcome to go.pixelfactory.io')
});

router.get('/:name+', ({ params }) => {
	const name = params.name
	
	let pkg = config.packages[name];
	if (pkg === undefined) {
		return new Response('404, not found!', { status: 404 })
	}
	
	if (pkg.url === undefined) {
		pkg.url = config.url
	}

	if (pkg.godoc === undefined) {
		pkg.godoc = config.godoc
	}

	if (pkg.vcs === undefined) {
		pkg.vcs = 'git'
	}

	const modulePath = `${pkg.url}/${name}`
	
	const html = `<!DOCTYPE html>
<html>
<head>
<meta name="go-import" content="${modulePath} ${pkg.vcs} https://${pkg.repo}">
<meta name="go-source" content="${modulePath} https://${pkg.repo} https://${pkg.repo}/tree/master{/dir} https://${pkg.repo}/tree/master{/dir}/{file}#L{line}">
<meta http-equiv="refresh" content="0; url=https://${pkg.godoc}/${modulePath}">
</head>
<body>
Nothing to see here. Please go to<a href="https://${pkg.godoc}/${modulePath}"></a>.
</body>
</html>`

	return new Response(html, {
		headers: {
			"content-type": "text/html;charset=UTF-8",
		},
	});

})

router.all('*', () => new Response('404, not found!', { status: 404 }))

export default {
	fetch: router.fetch
};

