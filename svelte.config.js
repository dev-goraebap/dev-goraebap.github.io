import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';
import { createHighlighter } from 'shiki';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeCallouts from './src/lib/rehype-callouts.js';
import remarkRelativeImages from './src/lib/remark-relative-images.js';

const highlighter = await createHighlighter({
	themes: ['github-light', 'github-dark'],
	langs: [
		'javascript',
		'typescript',
		'svelte',
		'html',
		'css',
		'bash',
		'json',
		'markdown',
		'yaml',
		'dockerfile'
	]
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [
		mdsvex({
			extensions: ['.md'],
			remarkPlugins: [remarkRelativeImages],
			rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }], rehypeCallouts, [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }]],
			highlight: {
				highlighter: (code, lang) => {
					if (lang === 'mermaid') {
						const escaped = code.replace(/`/g, '\\`').replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
						return `{@html \`<div class="mermaid">${escaped}</div>\`}`;
					}
					const html = highlighter.codeToHtml(code, {
						lang: lang || 'text',
						themes: { light: 'github-light', dark: 'github-dark' }
					});
					return `{@html \`${html.replace(/`/g, '\\`')}\`}`;
				}
			}
		})
	],
	kit: {
		adapter: adapter({ fallback: '404.html' }),
		prerender: {
			handleHttpError: 'warn'
		}
	}
};

export default config;
