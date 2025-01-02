import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
	index('routes/home.tsx'),
	route('projects/:projectId/tests/:testId', 'routes/testHistory/index.tsx'),
] satisfies RouteConfig;
