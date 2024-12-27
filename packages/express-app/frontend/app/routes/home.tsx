import type { LoaderFunction } from 'react-router';
import { LoaderContext } from '../../../LoaderContext';

export function meta() {
	return [
		{ title: 'NoFlake' },
		{
			name: 'description',
			content: 'A system for managing and triaging test flakes.',
		},
	];
}

export const loader: LoaderFunction<LoaderContext> = async ({ context }) => {
	const history = await context?.api.getTestHistory({
		projectId: '1',
		testId: 'test',
	});
	return { history };
};

export default function Home(props: any) {
	return (
		<div>
			<p>No flake frontend</p>
			<br />
			<br />
			<pre>{JSON.stringify(props, null, 2)}</pre>
		</div>
	);
}
