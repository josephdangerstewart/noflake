import { IProject } from '@noflake/fsd-gen';
import { DatabaseInsertError, validateRequiredProperties } from '@noflake/errors';
import { Database } from '../database';
import { parseId, stringifyId } from './serviceUtility';

export class ProjectService {
	private database: Database;

	constructor(database: Database) {
		this.database = database;
	}

	public getProject = async (projectId: string): Promise<IProject | undefined> => {
		const result = await this.database
			.selectFrom('projects')
			.selectAll()
			.where('id', '=', parseId(projectId))
			.executeTakeFirst();

		if (!result) {
			return;
		}

		return {
			name: result.name,
			projectId: stringifyId(result.id),
		};
	};

	public createProject = async (project: Omit<IProject, 'id'>): Promise<IProject> => {
		validateRequiredProperties(project, 'name');

		const result = await this.database
			.insertInto('projects')
			.values({
				name: project.name,
			})
			.executeTakeFirst();

		if (!result.insertId || result.numInsertedOrUpdatedRows !== 1n) {
			throw new DatabaseInsertError('projects');
		}

		return {
			...project,
			projectId: stringifyId(result.insertId),
		};
	};
}
