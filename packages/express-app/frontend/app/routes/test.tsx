import { data, LoaderFunctionArgs, useLoaderData, useParams } from 'react-router';
import { LoaderContext } from '../../../LoaderContext';
import { getErrorCode } from '../../util/errorCodes';

export const loader = async ({
	context,
	params,
}: LoaderFunctionArgs<LoaderContext>) => {
	const { projectId, testId } = params;
	const { api } = context ?? {};

	if (!projectId || !testId) {
		return data(null, { status: 404 });
	}

	if (!api) {
		return data(null, { status: 500 });
	}

	const history = await api.getTestHistory({
		projectId,
		testId,
	});

	if (history.error) {
		return data(null, { status: getErrorCode(history.error.code) });
	}

	return { history: history.value?.history ?? [] };
};

export default function TestPage() {
	const { history } = useLoaderData<typeof loader>() ?? { history: [] };
	const { testId, projectId } = useParams();

	return (
		<div>
			<h1>{projectId}: {testId}</h1>
			<pre>
				{JSON.stringify(history, null, 2)}
			</pre>
		</div>
	);
}
