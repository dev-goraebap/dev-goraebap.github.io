export async function load() {
	const about = await import('../../../about.md');
	return { content: about.default };
}
