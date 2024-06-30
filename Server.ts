#!/usr/bin/env node_modules/tsx/dist/cli.mjs 

import {renderToString} from 'solid-js/web';
//import {renderToString} from 'solid-js/web/dist/server.js';


async function run()
{
	const templates  = <any> new (await import('./dist/Templates.js')).Templates();


	const content = renderToString(() =>  {
	console.log('Server renderContent() -- 1');
		const ret = (<(props:any)=>Element> templates.managerPage)({xxx:'blah'})
	console.log('Server renderContent() -- 2 ret:',ret);
		return ret;
	});

	console.log('content:',content);
}

run()
.then(() => console.log('DONE'));


