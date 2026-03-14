import { error } from '@sveltejs/kit';

const coverModules = import.meta.glob('/src/posts/*/assets/cover.png', {
	eager: true,
	import: 'default',
	query: '?url'
}) as Record<string, string>;

export async function load({ params }) {
	try {
		const post = await import(`../../../../posts/${params.slug}/index.md`);
		const coverUrl = coverModules[`/src/posts/${params.slug}/assets/cover.png`];
		return {
			content: post.default,
			meta: {
				...post.metadata,
				cover: coverUrl ?? undefined
			},
			slug: params.slug
		};
	} catch {
		error(404, `"${params.slug}" 글을 찾을 수 없습니다.`);
	}
}
