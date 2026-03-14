/**
 * Remark plugin to transform relative image paths into Vite imports.
 *
 * Converts:  ![alt](./assets/foo.jpg)
 * Into:      <script> import _img0 from './assets/foo.jpg'; </script>
 *            <img src={_img0} alt="alt" />
 *
 * This allows images co-located with markdown files to be processed by Vite.
 */
export default function remarkRelativeImages() {
	return (tree) => {
		const imports = [];
		let counter = 0;

		function visit(node) {
			if (!node.children) return;

			for (let i = 0; i < node.children.length; i++) {
				const child = node.children[i];

				if (child.type === 'image' && child.url?.startsWith('./')) {
					const varName = `_img${counter++}`;
					imports.push(`import ${varName} from '${child.url}';`);
					const alt = (child.alt || '').replace(/"/g, '&quot;');
					node.children[i] = {
						type: 'html',
						value: `<img src={${varName}} alt="${alt}" />`
					};
					continue;
				}

				visit(child);
			}
		}

		visit(tree);

		if (imports.length > 0) {
			tree.children.unshift({
				type: 'html',
				value: `<script>\n${imports.join('\n')}\n</script>`
			});
		}
	};
}
