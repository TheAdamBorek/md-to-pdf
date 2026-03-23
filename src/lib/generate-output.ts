import { execSync } from 'child_process';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { Config, HtmlConfig, PdfConfig } from './config';

export type Output = PdfOutput | HtmlOutput;

export interface PdfOutput extends BasicOutput {
	content: Buffer;
}

export interface HtmlOutput extends BasicOutput {
	content: string;
}

interface BasicOutput {
	filename: string | undefined;
}

/**
 * Generate the output (either PDF or HTML) using Chrome's --print-to-pdf.
 */
export async function generateOutput(html: string, relativePath: string, config: PdfConfig): Promise<PdfOutput>;
export async function generateOutput(html: string, relativePath: string, config: HtmlConfig): Promise<HtmlOutput>;
export async function generateOutput(html: string, relativePath: string, config: Config): Promise<Output>;
export async function generateOutput(html: string, _relativePath: string, config: Config): Promise<Output> {
	if (config.as_html) {
		return { filename: config.dest, content: html };
	}

	const tempDir = tmpdir();
	const htmlPath = join(tempDir, `md-to-pdf-${Date.now()}.html`);
	const pdfPath = join(tempDir, `md-to-pdf-${Date.now()}.pdf`);

	await fs.writeFile(htmlPath, html);

	try {
		const chrome = config.chrome_path;

		execSync(
			`"${chrome}" --headless --print-to-pdf="${pdfPath}" --no-margins --no-pdf-header-footer --disable-gpu "file://${htmlPath}"`,
			{ stdio: 'ignore' },
		);

		const content = await fs.readFile(pdfPath);

		return { filename: config.dest, content };
	} finally {
		// clean up temp files
		await fs.unlink(htmlPath).catch(() => {});
		await fs.unlink(pdfPath).catch(() => {});
	}
}
