export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		let pathname = url.pathname;

		// Normalize trailing slash
		if (pathname.length > 1 && pathname.endsWith('/')) {
			pathname = pathname.slice(0, -1);
		}

		const segments = pathname.split('/').filter(Boolean);

		// No slug present; treat as root-level request (e.g., /manifest.json)
		if (segments.length === 1 && segments[0].includes('.')) {
			const key = segments[0];
			return fetchFromBucket(key, env);
		}

		let key: string;

		if (segments.length >= 2 && !segments[segments.length - 1].includes('.')) {
			// Two-level slug path for clean URL style
			const slug = `${segments[0]}/${segments[1]}`;
			const restPath = segments.slice(2).join('/') || 'index.html';
			key = `${slug}/${restPath}`;
			if (!key.endsWith('/')) {
				key = `${slug}/${restPath}/index.html`;
			}
		} else if (segments.length === 1 && !segments[0].includes('.')) {
			// No-slug clean URL → assume default site slug like 'my-site-slug-40'
			const slug = 'my-site-slug-41'; // TODO: dynamic if needed
			const restPath = segments[0];
			key = `${slug}/${restPath}/index.html`;
		} else {
			// Default to one-level slug + path
			const slug = segments[0];
			const restPath = segments.slice(1).join('/') || 'index.html';
			key = `${slug}/${restPath}`;
			if (!key.includes('.') && !key.endsWith('/')) {
				key = `${slug}/${restPath}/index.html`;
			}
		}

		return fetchFromBucket(key, env);
	},
};

async function fetchFromBucket(key: string, env: Env): Promise<Response> {
	try {
		if (!env.SITE_BUCKET || typeof env.SITE_BUCKET.get !== 'function') {
			console.warn('SITE_BUCKET is not available (likely in local dev)');
			return new Response('<h1>Mock page in local dev</h1>', {
				headers: { 'content-type': 'text/html' },
			});
		}

		const object = await env.SITE_BUCKET.get(key);
		if (object) {
			const text = await object.text();
			console.log('🔍 실제 HTML:\n', text.slice(0, 2000)); // 맨 앞만 출력
		}
		if (!object || !object.body) {
			console.warn('R2 object not found for key:', key);
			return new Response('Not Found', { status: 404 });
		}

		const headers = new Headers();
		headers.set('content-type', object.httpMetadata?.contentType ?? 'application/octet-stream');
		return new Response(object.body, { headers });
	} catch (err) {
		console.error('Worker error', err);
		return new Response('Internal Error', { status: 500 });
	}
}
