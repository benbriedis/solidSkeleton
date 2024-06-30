#!/usr/bin/env ./node_modules/tsx/dist/cli.mjs 

import {build as rollupBuild} from './Rollup';
//import browserOptions from './rollup.client';
import serverOptions from './rollup.server';

let targetDir!:string;

async function run()
{
//	await rollupBuild(targetDir,browserOptions,/*Show details:*/false);
	await rollupBuild(targetDir,serverOptions,false);
}

run()
.then(() => console.log('DONE'))
.catch(console.error);



