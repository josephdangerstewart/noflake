import express from 'express';
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

	app.use('/app', frontendApp);

	app.use('/api', async (request, response) => {
		const api = await getApi(request);
		return createApp(api)(request, response);
	});

	return app;
}
