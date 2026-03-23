import { WatchOptions } from 'chokidar';
import { GrayMatterOption } from 'gray-matter';
import { marked } from 'marked';
import { resolve } from 'path';

export const defaultConfig: Config = {
	basedir: process.cwd(),
	stylesheet: [resolve(__dirname, '..', '..', 'markdown.css')],
	script: [],
	css: '',
	document_title: '',
	body_class: [],
	page_media_type: 'screen',
	highlight_style: 'github',
	marked_options: {},
	pdf_options: {
		format: 'a4',
		margin: {
			top: '30mm',
			right: '40mm',
			bottom: '30mm',
			left: '20mm',
		},
	},
	chrome_path: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
	gray_matter_options: {
		engines: {
			javascript: () =>
				new Error(
					'The JS engine for front-matter is disabled by default for security reasons. You can enable it by configuring gray_matter_options.',
				),
		},
	},
	md_file_encoding: 'utf-8',
	stylesheet_encoding: 'utf-8',
	as_html: false,
	devtools: false,
	marked_extensions: [],
};

/**
 * In config keys, dashes of cli flag names are replaced with underscores.
 */
export type Config = PdfConfig | HtmlConfig;

export interface PdfConfig extends BasicConfig {
	/**
	 * If true, generate HTML output instead of PDF output. Default: `false`.
	 */
	as_html?: false;
}

export interface HtmlConfig extends BasicConfig {
	/**
	 * If true, generate HTML output instead of PDF output. Default: `false`.
	 */
	as_html: true;
}

export interface PdfOptions {
	format?: string;
	margin?: { top?: string; right?: string; bottom?: string; left?: string } | string;
	printBackground?: boolean;
	headerTemplate?: string;
	footerTemplate?: string;
	displayHeaderFooter?: boolean;
}

interface BasicConfig {
	/**
	 * Base directory to be served by the file server.
	 */
	basedir: string;

	/**
	 * Optional destination path for the output file (including the extension).
	 */
	dest?: string;

	/**
	 * List of css files to use for styling.
	 */
	stylesheet: string[];

	/**
	 * Custom css styles.
	 */
	css: string;

	/**
	 * List of script URLs or paths to load into the page.
	 */
	script: string[];

	/**
	 * Name of the HTML Document.
	 */
	document_title: string;

	/**
	 * List of classes for the body tag.
	 */
	body_class: string[];

	/**
	 * Media type to emulate the page with.
	 */
	page_media_type: 'screen' | 'print';

	/**
	 * Highlight.js stylesheet to use (without the .css extension).
	 *
	 * @see https://github.com/isagalaev/highlight.js/tree/master/src/styles
	 */
	highlight_style: string;

	/**
	 * Options for the Marked parser.
	 *
	 * @see https://marked.js.org/#/USING_ADVANCED.md
	 */
	marked_options: marked.MarkedOptions;

	/**
	 * PDF options.
	 */
	pdf_options: PdfOptions;

	/**
	 * Path to the Chrome/Chromium executable.
	 */
	chrome_path: string;

	/**
	 * Options for gray-matter (front-matter parser).
	 *
	 * @see https://github.com/jonschlinkert/gray-matter#options
	 */
	gray_matter_options: GrayMatterOption<string, any>;

	/**
	 * Markdown file encoding. Default: `utf-8`.
	 */
	md_file_encoding: string;

	/**
	 * CSS stylesheet encoding. Default: `utf-8`.
	 */
	stylesheet_encoding: string;

	/**
	 * If true, open chromium with devtools instead of saving the pdf. This is
	 * meant for development only, to inspect the rendered HTML.
	 */
	devtools: boolean;

	/**
	 * Port to run the local server on.
	 */
	port?: number;

	/**
	 * Options to pass to Chokidar's `watch` call.
	 */
	watch_options?: WatchOptions;

	/**
	 * Custom Extensions to be passed to marked.
	 *
	 * @see https://marked.js.org/using_pro#extensions
	 */
	marked_extensions: marked.MarkedExtension[];
}
