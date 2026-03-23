import { readFileSync } from 'fs';
import { Config } from './config';
import { getMarked } from './get-marked-with-highlighter';
import { isHttpUrl } from './is-http-url';

/**
 * Generates a self-contained HTML document from a markdown string.
 * Stylesheets are inlined so the HTML can be rendered by Chrome CLI without a server.
 */
export const getHtml = (md: string, config: Config) => {
	const body = getMarked(config.marked_options, config.marked_extensions)(md);
	const hasMermaid = body.includes('<div class="mermaid">');

	const styleTags = config.stylesheet
		.map((stylesheet) => {
			if (isHttpUrl(stylesheet)) {
				return `<link rel="stylesheet" href="${stylesheet}">`;
			}

			const css = readFileSync(stylesheet, 'utf-8');
			return `<style>${css}</style>`;
		})
		.join('\n\t');

	const customCss = config.css ? `<style>${config.css}</style>` : '';

	const mermaidScript = hasMermaid
		? `<script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
	<script>mermaid.initialize({ startOnLoad: true });</script>`
		: '';

	return `<!DOCTYPE html>
<html>
	<head>
		<title>${config.document_title}</title>
		<meta charset="utf-8">
		<base href="file://${config.basedir}/">
		${styleTags}
		${customCss}
	</head>
	<body class="${config.body_class.join(' ')}">
		${body}
		${mermaidScript}
	</body>
</html>
`;
};
