import { StartedMySqlContainer, MySqlContainer } from '@testcontainers/mysql';
import { cleanupDatabase, initializeDatabase } from '../database';
import { DatabaseConnectionOptions } from '../database/getDatabase';

let databaseOptions: DatabaseConnectionOptions | undefined;
let databaseContainer: StartedMySqlContainer | undefined;

export function getDatabaseOptions() {
	if (!databaseOptions) {
		throw new Error('database options are not set. Is the database running?');
	}

	return databaseOptions;
}

beforeAll(async () => {
	databaseContainer = await new MySqlContainer('mysql:8')
		.withDatabase('noflake_test')
		.withRootPassword('root')
		.start();

	databaseOptions = databaseContainer.getConnectionUri();

	await initializeDatabase(databaseOptions);
}, 300_000);

afterAll(async () => {
	await cleanupDatabase();
	await databaseContainer?.stop();
}, 300_000);
