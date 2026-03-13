import { error } from '@sveltejs/kit';

export async function load({ params }) {
	try {
		const post = await import(`../../../../posts/${params.slug}.md`);
		return {
			content: post.default,
			meta: post.metadata,
			slug: params.slug
		};
	} catch {
		error(404, `"${params.slug}" 글을 찾을 수 없습니다.`);
	}
}
