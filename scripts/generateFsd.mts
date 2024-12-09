import { exec as execSync } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

const exec = promisify(execSync);

console.log('cwd', process.cwd());

const fsdPath = path.join('fsd', 'NoFlake.fsd');
const outDir = path.join('fsd-temp');
const packages = path.join('packages');

await fs.mkdir(outDir, { recursive: true });
await exec(`dotnet tool run fsdgenjs ${fsdPath} ${outDir} --typescript --disable-eslint --express`);

await fs.rename(path.join(outDir, 'noFlakeTypes.ts'), path.join(packages, 'interface', 'noFlakeTypes.ts'));
