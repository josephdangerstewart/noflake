import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { createRequestHandler } from '@react-router/express';
import { createApp, INoFlake } from '@noflake/fsd-gen/server';

export interface CreateExpressAppOptions {
	getApi: (request: express.Request) => Promise<INoFlake>;
}

export function createExpressApp({ getApi }: CreateExpressAppOptions): express.Express {
	const app = express();

	const frontendApp = createRequestHandler({
		// TODO: Add type gen to build
		// @ts-expect-error React router build output does not include types.
		build: () => import('./build/server'),
	});

	app.use('/assets', express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), 'build', 'client', 'assets')));

	app.use('/app', frontendApp);

	app.use('/api', async (request, response) => {
		const api = await getApi(request);
		return createApp(api)(request, response);
	});

	return app;
}
