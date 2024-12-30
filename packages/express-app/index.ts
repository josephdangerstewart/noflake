import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { createRequestHandler } from '@react-router/express';
import { createApp, INoFlake } from '@noflake/fsd-gen/server';

export interface CreateExpressAppOptions {
	getApi: (request: express.Request) => Promise<INoFlake>;
}

export function createExpressApp(options: CreateExpressAppOptions): express.Express {
	const { getApi } = options;
	const { __private = {} } = options as any;
	const app = express();

	app.use(async (request, _, next) => {
		const api = await getApi(request);
		(request as any).__noflake = { api };
		next();
	});

	const frontendApp = createRequestHandler({
		// TODO: Add type gen to build
		// @ts-expect-error React router build output does not include types.
		build: __private.getServer ?? (() => import('./build/server')),
		getLoadContext: (request) => (request as any).__noflake,
	});

	app.use('/assets', express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), 'build', 'client', 'assets')));

	app.use('/app', frontendApp);

	app.use('/api', (request, response) => {
		const api = (request as any).__noflake.api;
		return createApp(api)(request, response);
	});

	return app;
}
