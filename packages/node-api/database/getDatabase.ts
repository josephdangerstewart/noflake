import { DeduplicateJoinsPlugin, Kysely, MysqlDialect } from 'kysely';
import { NoFlakeDatabase } from './databaseTypes';
import { PoolOptions, createPool } from 'mysql2';

export type DatabaseConnectionOptions = PoolOptions | string;
export type Database = Kysely<NoFlakeDatabase>;

let database: Database | undefined;
let isDestroyed = false;

export function getDatabase(poolOptions: DatabaseConnectionOptions): Database {
	if (isDestroyed) {
		throw new Error('Database has been destroyed');
	}

	if (!database) {
		database = new Kysely<NoFlakeDatabase>({
			dialect: new MysqlDialect({
				pool: createPool(poolOptions as any),
			}),
			plugins: [new DeduplicateJoinsPlugin()],
		});

		return database;
	}

	return database;
}

export async function cleanupDatabase() {
	isDestroyed = true;
	if (database) {
		await database.destroy();
	}
}
