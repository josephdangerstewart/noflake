import { exec as execSync } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

const exec = promisify(execSync);

const fsdPath = path.join('fsd', 'NoFlake.fsd');
const nodeApiOutDir = path.join('packages', 'fsd-gen');

await fs.mkdir(nodeApiOutDir, { recursive: true });
await exec(`dotnet tool run fsdgenjs ${fsdPath} ${nodeApiOutDir} --typescript --disable-eslint --express`);

const serverFilePath = path.join(nodeApiOutDir, 'noFlakeServer.ts');
const serverFileContents = await fs.readFile(serverFilePath, { encoding: 'utf-8' });
const fixedServerFileContents = serverFileContents
	.replaceAll('import * as express', 'import express')
	.replaceAll('import * as bodyParser', 'import bodyParser');

await fs.writeFile(serverFilePath, fixedServerFileContents, { encoding: 'utf-8' });
