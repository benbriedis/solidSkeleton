import {ErrorBoundary} from 'solid-js';

export function ManagerPage(props:any) 
{
	return (
		<ErrorBoundary fallback={<div>GOT ERROR</div>}>
			<div>
				HERE
			</div>
		</ErrorBoundary>
	);
}

