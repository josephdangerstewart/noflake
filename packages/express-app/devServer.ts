import { createExpressApp } from './index';
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

	const app = createExpressApp({
		getApi: () =>
			Promise.resolve(
				new NoFlakeApi({
					database: databaseOptions,
					permissionService: new AdminPermissionService(),
				}),
			),
	});

	app.listen(8080, () => console.log('server listening on 8080'));
}

main();
