import express from 'express';
import { createApp, INoFlake } from '@noflake/fsd-gen/server';

export interface CreateExpressAppOptions {
	getApi: (request: express.Request) => Promise<INoFlake>;
}

export function createExpressApp({ getApi }: CreateExpressAppOptions): express.Express {
	const app = express();

	app.use('/api', async (request, response) => {
		const api = await getApi(request);
		return createApp(api)(request, response);
	});

	return app;
}
