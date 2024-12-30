import { createExpressApp, CreateExpressAppOptions } from './index';
import { createServer } from 'vite';
import {
	NoFlakeApi,
	initializeDatabase,
	IPermissionService,
	PermissionPolicy,
	Scope,
	DatabaseConnectionOptions,
} from '@noflake/node-api';

class AdminPermissionService implements IPermissionService {
	getPermissions: <TScope extends Scope>(
		scope: TScope,
	) => Promise<PermissionPolicy<TScope['kind']>[]> = () =>
		Promise.resolve(['*']);
}

const databaseOptions: DatabaseConnectionOptions = {
	host: 'localhost',
	user: 'root',
	password: 'secret',
	database: 'noflake',
};

async function main() {
	await initializeDatabase(databaseOptions);

	const viteServer = await createServer({
		server: { middlewareMode: true },
		appType: 'custom',
	});

	const options = {
		getApi: () =>
			Promise.resolve(
				new NoFlakeApi({
					database: databaseOptions,
					permissionService: new AdminPermissionService(),
				}),
			),
		__private: {
			getServer: () => viteServer.ssrLoadModule('virtual:react-router/server-build')
		}
	} as CreateExpressAppOptions;
	const app = createExpressApp(options);

	app.use(viteServer.middlewares);
	app.listen(8080, () => console.log('server listening on 8080'));
}

main();
