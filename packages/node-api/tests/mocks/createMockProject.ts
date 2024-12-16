import { NoFlakeApi } from "../../NoFlakeApi";
import { getDatabaseOptions } from "../database";
import { MockPermissionService } from "./MockPermissionService";

export async function createMockProject() {
	const api = new NoFlakeApi({
		database: getDatabaseOptions(),
		permissionService: new MockPermissionService('*'),
	});

	const result = await api.createProject({
		project: {
			name: 'My cool project',
		},
	});

	if (!result.value?.project?.projectId) {
		throw new Error('failed to create project');
	}

	return result.value.project;
} 
