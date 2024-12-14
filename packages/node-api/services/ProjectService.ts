import { IProject } from '@noflake/fsd-gen';
import { Database } from '../database';
import { validateRequiredProperties } from './errors';

export class ProjectService {
	private database: Database;

	constructor(database: Database) {
		this.database = database;
	}

	public createProject = async (project: Omit<IProject, 'id'>): Promise<IProject> => {
		validateRequiredProperties(project, 'name');

		const result = await this.database
			.insertInto('projects')
			.values({
				name: project.name,
			})
			.executeTakeFirst();

		return {
			...project,
			projectId: `${result.insertId}`,
		};
	};
}
