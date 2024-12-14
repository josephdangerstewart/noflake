import { FileMigrationProvider, Migrator } from 'kysely';
import { PoolOptions } from 'mysql2';
import path from 'path';
import fs from 'fs/promises';
import { getDatabase } from './getDatabase';

export async function runMigration(poolOptions: PoolOptions) {
	const db = getDatabase(poolOptions);

	try {
		console.log(`looking for migrations in ${path.join(__dirname, 'migrations')}`);
		const migrator = new Migrator({
			db,
			provider: new FileMigrationProvider({
				path,
				fs,
				migrationFolder: path.join(__dirname, 'migrations'),
			}),
		});

		console.log('initialized migrator, fetching migrations');
		const migrations = await migrator.getMigrations();
		const firstUnexectedMigration = migrations.find(x => !x.executedAt);
		const lastMigration = migrations.at(-1);

		if (firstUnexectedMigration) {
			console.log(`migrating from ${firstUnexectedMigration.name} to ${lastMigration?.name}`);
		} else {
			console.log('no migrations to run');
		}

		const { error, results } = await migrator.migrateToLatest();
	
		for (const result of results ?? []) {
			console.log(`${result.migrationName} [${result.direction}]: ${result.status.toUpperCase()}`);
		}
	
		if (error) {
			console.error('failed to migrate');
			console.error(error);
			throw new Error('failed to migrate');
		}
	} catch (error) {
		console.error('An unexpected error occurred');
		console.error(error);
	} finally {
		await db.destroy();
	}
}
