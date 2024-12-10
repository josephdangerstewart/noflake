import { PlopTypes } from '@turbo/gen';
import { exec } from 'child_process';
import { promisify } from 'util';

export default function generator(plop: PlopTypes.NodePlopAPI): void {
	plop.setGenerator('basic', {
		description: 'Generates a new default package in the repo',
		prompts: [
			{
				type: 'input',
				name: 'packageName',
				message: 'What is the name of this package?',
				validate: (input: string) => {
					if (/[\.@\s0-9\\\/]/.test(input)) {
						return 'name contains illegal characters';
					}

					if (/[A-Z]/.test(input)) {
						return 'name should be all lower case';
					}

					if (!input) {
						return 'package name is required';
					}

					return true;
				},
			},
		],
		actions: [
			{
				type: 'addMany',
				templateFiles: 'templates/basic/**/*.hbs',
				base: 'templates/basic',
				globOptions: { dot: true },
				destination: '{{ turbo.paths.root }}/packages/{{ packageName }}',
			},
			async (inputs: any) => {
				await promisify(exec)('pnpm install', {
					cwd: `${inputs.turbo.paths.root}/packages/${inputs.packageName}`,
				});

				return 'installed dependencies';
			},
		],
	});
}
