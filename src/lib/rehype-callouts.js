/**
 * Custom rehype plugin to transform GitHub-style alert blockquotes into callouts.
 */

// hast element nodes for SVG icons (stroke="currentColor" inherits title color)
const ICONS = {
	NOTE: {
		label: 'Note',
		// info circle
		paths: [
			{ tag: 'circle', props: { cx: '12', cy: '12', r: '10' } },
			{ tag: 'line', props: { x1: '12', y1: '16', x2: '12', y2: '12' } },
			{ tag: 'line', props: { x1: '12', y1: '8', x2: '12.01', y2: '8' } },
		],
	},
	TIP: {
		label: 'Tip',
		// lightbulb
		paths: [
			{ tag: 'path', props: { d: 'M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5' } },
			{ tag: 'path', props: { d: 'M9 18h6' } },
			{ tag: 'path', props: { d: 'M10 22h4' } },
		],
	},
	IMPORTANT: {
		label: 'Important',
		// bookmark/star
		paths: [
			{ tag: 'polygon', props: { points: '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' } },
		],
	},
	WARNING: {
		label: 'Warning',
		// triangle alert
		paths: [
			{ tag: 'path', props: { d: 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z' } },
			{ tag: 'line', props: { x1: '12', y1: '9', x2: '12', y2: '13' } },
			{ tag: 'line', props: { x1: '12', y1: '17', x2: '12.01', y2: '17' } },
		],
	},
	CAUTION: {
		label: 'Caution',
		// circle X
		paths: [
			{ tag: 'circle', props: { cx: '12', cy: '12', r: '10' } },
			{ tag: 'line', props: { x1: '15', y1: '9', x2: '9', y2: '15' } },
			{ tag: 'line', props: { x1: '9', y1: '9', x2: '15', y2: '15' } },
		],
	},
};

function makeSvgNode(type) {
	const info = ICONS[type];
	return {
		type: 'element',
		tagName: 'svg',
		properties: {
			xmlns: 'http://www.w3.org/2000/svg',
			width: '14',
			height: '14',
			viewBox: '0 0 24 24',
			fill: 'none',
			stroke: 'currentColor',
			strokeWidth: '2',
			strokeLinecap: 'round',
			strokeLinejoin: 'round',
			ariaHidden: 'true',
		},
		children: info.paths.map(({ tag, props }) => ({
			type: 'element',
			tagName: tag,
			properties: props,
			children: [],
		})),
	};
}

export default function rehypeCallouts() {
	return (tree) => {
		visit(tree);
	};

	function visit(node) {
		if (!node.children) return;

		for (let i = 0; i < node.children.length; i++) {
			const child = node.children[i];

			if (child.type === 'element' && child.tagName === 'blockquote') {
				const converted = convertBlockquote(child);
				if (converted) {
					node.children[i] = converted;
					continue;
				}
			}

			visit(child);
		}
	}
}

function convertBlockquote(node) {
	const firstP = node.children?.find((c) => c.type === 'element' && c.tagName === 'p');
	if (!firstP) return null;

	const firstText = firstP.children?.[0];
	if (!firstText || firstText.type !== 'text') return null;

	const match = firstText.value.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i);
	if (!match) return null;

	const type = match[1].toUpperCase();
	const info = ICONS[type];

	const remaining = firstText.value.slice(match[0].length).trim();

	const titleNode = {
		type: 'element',
		tagName: 'p',
		properties: { className: ['markdown-alert-title'] },
		children: [
			makeSvgNode(type),
			{ type: 'text', value: ` ${info.label}` },
		],
	};

	const restChildren = [...node.children];
	const firstPIndex = restChildren.findIndex((c) => c.type === 'element' && c.tagName === 'p');
	if (remaining) {
		restChildren[firstPIndex] = {
			...firstP,
			children: [{ type: 'text', value: remaining }, ...firstP.children.slice(1)],
		};
	} else {
		restChildren.splice(firstPIndex, 1);
	}

	return {
		type: 'element',
		tagName: 'div',
		properties: {
			className: ['markdown-alert', `markdown-alert-${type.toLowerCase()}`],
		},
		children: [titleNode, ...restChildren],
	};
}
