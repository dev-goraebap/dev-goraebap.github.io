export const prerender = true;

import { getPosts } from '$lib/posts';

export async function load() {
	const posts = await getPosts();
	return { posts };
}
