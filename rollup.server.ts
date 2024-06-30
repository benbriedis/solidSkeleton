import { babel } from '@rollup/plugin-babel';
//import esbuild from 'rollup-plugin-esbuild';
import alias  from '@rollup/plugin-alias';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {PluginContext, RollupOptions} from 'rollup';

const topDir = dirname(fileURLToPath(import.meta.url));

const extensions = ['.ts','.tsx'];  

function resolveExtensions(extensions:string[])
{
	return async function (this:PluginContext,source:string) {
		for (const extension of extensions) {
			try {
				const moduleInfo = await this.load({ id: source + extension });
				return moduleInfo.id;
			} 
			catch {}
		};
		return null;
	}
}


export default <RollupOptions> {
	input: [ 
		'./Templates.tsx'
	],

	plugins: [
		/* Handle Solid */
		babel({
//XXX Q: if I include '.ts' here could I do without the Templates.tsx file (on the server at least?)
//       Might think about using the esbuild plugin here as well in that case.
			extensions: ['.tsx'],

			babelHelpers: 'bundled',
			presets: [
    			['solid', { generate: 'ssr', hydratable: true }],
				'@babel/preset-typescript'
			],
			plugins: [
			],
		}),    

		nodeResolve({
			extensions: extensions,
//XXX appears to break SSR when errorBoundary is used
//			exportConditions: ['node']
		}),

		alias({
			customResolver: resolveExtensions(['.ts','.tsx'])
		}),
	], 
	output: {
		dir: 'dist',
//		format: 'es',  
		format: 'cjs',  
		sourcemap: 'inline',
	}
}
