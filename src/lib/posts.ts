export interface PostMeta {
	title: string;
	description: string;
	date: string;
	tags: string[];
	cover?: string;
	published: boolean;
	order?: number;
}

export interface Post {
	meta: PostMeta;
	slug: string;
}

export async function getPosts(): Promise<Post[]> {
	const modules = import.meta.glob('/src/posts/*.md', { eager: true });

	const posts: Post[] = [];

	for (const [path, module] of Object.entries(modules)) {
		const { metadata } = module as { metadata: PostMeta };
		const slug = path.split('/').pop()!.replace('.md', '');

		if (metadata.published) {
			posts.push({ meta: metadata, slug });
		}
	}

	posts.sort((a, b) => {
		const aIsOld = a.meta.date === 'LONG_AGO';
		const bIsOld = b.meta.date === 'LONG_AGO';

		// 오래전 글은 항상 뒤로
		if (aIsOld && bIsOld) return (b.meta.order ?? 0) - (a.meta.order ?? 0);
		if (aIsOld) return 1;
		if (bIsOld) return -1;

		return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
	});

	return posts;
}

export function formatDate(dateStr: string): string {
	if (dateStr === 'LONG_AGO') return '오래전';
	return new Date(dateStr).toLocaleDateString('ko-KR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

export function timeAgo(dateStr: string): string {
	if (dateStr === 'LONG_AGO') return '오래전';
	const now = Date.now();
	const past = new Date(dateStr).getTime();
	const diff = now - past;

	const minutes = Math.floor(diff / 60000);
	const hours = Math.floor(diff / 3600000);
	const days = Math.floor(diff / 86400000);
	const weeks = Math.floor(days / 7);
	const months = Math.floor(days / 30);
	const years = Math.floor(days / 365);

	if (minutes < 1) return '방금 전';
	if (minutes < 60) return `${minutes}분 전`;
	if (hours < 24) return `${hours}시간 전`;
	if (days < 7) return `${days}일 전`;
	if (weeks < 5) return `${weeks}주 전`;
	if (months < 12) return `${months}개월 전`;
	return `${years}년 전`;
}

export function estimateReadingTime(content: string): number {
	const charCount = content.replace(/\s/g, '').length;
	return Math.max(1, Math.ceil(charCount / 500));
}
