import hljs from 'highlight.js';
import { marked } from 'marked';

export const getMarked = (options: marked.MarkedOptions, extensions: marked.MarkedExtension[]) => {
	marked.setOptions({
		highlight: (code, languageName) => {
			const language = hljs.getLanguage(languageName) ? languageName : 'plaintext';

			return hljs.highlight(code, { language }).value;
		},
		langPrefix: 'hljs ',
		...options,
	});

	// Render mermaid code blocks as <div class="mermaid"> instead of <pre><code>
	const mermaidExtension: marked.MarkedExtension = {
		renderer: {
			code(code: string, language: string | undefined) {
				if (language === 'mermaid') {
					return `<div class="mermaid">${code}</div>`;
				}

				return false as any; // fall back to default renderer
			},
		},
	};

	marked.use(mermaidExtension, ...extensions);
	return marked;
};
