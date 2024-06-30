import {rollup, OutputOptions, RollupBuild, RollupOptions} from 'rollup';
import { inspect } from 'node:util';
import {createWriteStream} from 'node:fs';

/*
	The client and server are both build when there is a change, but we only want to restart
	the server and reload the page once.
*/
let inProgress = 0;

export function watch(options:RollupOptions,finishedBuild:()=>Promise<void> )
{
	const watcher = rollup.watch(options);

	watcher.on('event',async event => {
		/* If we want finer granularity we can also listen to BUNDLE_START and BUNDLE_END */

		if (event.code=='START')
			inProgress++;

//TODO handle error as well
		if (event.code=='END') {
			inProgress--;
			if (inProgress==0)
				await finishedBuild();
		}

		if (event.code=='ERROR') {
			console.error(event.error);
			if (event.result!=null) 
				console.error(event.result);
		}
	});
}


export async function build(targetDir:string,options:RollupOptions,showDetails:boolean) 
{
	let bundle;
	try {
		bundle = await rollup(options);

		const outputOptionsList = Array.isArray(options.output) ? options.output : [options.output];

		await Promise.all(outputOptionsList.map(bundle.write));

		if (showDetails)
			await outputWithDetails(targetDir,bundle,outputOptionsList);
	} 
	catch (error) {
		console.error(error);
		process.exit(1);
	}
	finally {
		await bundle?.close();
	}
}

async function outputWithDetails(targetDir:string,bundle:RollupBuild,outputOptionsList:OutputOptions[]) 
{
	const fp = createWriteStream(`${targetDir}/bundleDetails.txt`);

	try {
		for (const outputOptions of outputOptionsList) {
			const { output } = await bundle.generate(outputOptions);

			for (const i of output) {

				if (i.type === 'asset') {
					fp?.write(`Asset:`);
					fp?.write(inspect(i,{depth:10}));
				}
				else {
					delete (<any>i).code;
					fp?.write(`Chunk:`);
					fp?.write(inspect(i,{depth:10}));
				}
			}
		}
	}
	finally {
		fp?.close();
	}
}

