// DO NOT EDIT: generated by fsdgenjs
/* eslint-disable */

import { IServiceResult } from 'facility-core';

export interface INoFlake {
	createProject(request: ICreateProjectRequest, context?: unknown): Promise<IServiceResult<ICreateProjectResponse>>;

	submitTestSuiteResult(request: ISubmitTestSuiteResultRequest, context?: unknown): Promise<IServiceResult<ISubmitTestSuiteResultResponse>>;
}

/** Request for CreateProject. */
export interface ICreateProjectRequest {
}

/** Response for CreateProject. */
export interface ICreateProjectResponse {
	project?: IProject;
}

/** Request for SubmitTestSuiteResult. */
export interface ISubmitTestSuiteResultRequest {
	result?: ITestSuiteResult;
}

/** Response for SubmitTestSuiteResult. */
export interface ISubmitTestSuiteResultResponse {
}

export interface IProject {
	projectId?: string;

	name?: string;
}

export interface ITestSuiteResult {
	/** The sha of the git commit for which the test suite was run. */
	commitSha?: string;

	/** The project this run is associated with */
	projectId?: string;

	/** The results of the tests that were run for this suite. */
	results?: ITestResult[];
}

export interface ITestResult {
	/** An opaque token identifying this test. */
	testId?: string;

	/** The ending result of the test. */
	status?: TestResultStatus;

	/** Null if the test passed. */
	errors?: string[];

	/** A value of 1 indicates certainty that this test flaked (e.g. the test failed, was retried, and passed). A value of 0 indicates either the test did not flake (e.g. the test passed on the first try) or it is unknown if the test flaked or not. Values in between indicate the test may have flaked. */
	flakeConfidence?: number;
}

export interface ITestId {
	testId?: string;

	version?: string;
}

export enum TestResultStatus {
	pass = 'pass',

	fail = 'fail',
}

