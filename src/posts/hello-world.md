---
title: 'AI 에이전트와 함께 블로그를 만들다'
description: 'SvelteKit, mdsvex, Tailwind CSS로 정적 블로그를 구축한 과정을 기록합니다. AI 에이전트를 활용한 개발 워크플로우에 대한 이야기.'
date: '2026-03-11'
tags:
  - SvelteKit
  - AI
published: true
---

## 왜 직접 만들었나

블로그 플랫폼은 많다. Medium, Velog, Tistory. 하지만 **내 글이 내 도메인에 있어야 한다**는 생각은 변하지 않았다. 콘텐츠의 소유권, 디자인의 자유도, 그리고 무엇보다 개발자로서 직접 만드는 즐거움.

## 기술 스택

이 블로그는 다음 기술로 만들어졌다:

- **SvelteKit** — 빠르고 가벼운 풀스택 프레임워크
- **mdsvex** — 마크다운 안에서 Svelte 컴포넌트를 사용
- **Tailwind CSS** — 유틸리티 퍼스트 스타일링
- **adapter-static** — 정적 사이트 생성 (SSG)
- **GitHub Pages** — 무료 호스팅

## 코드 하이라이팅

Shiki를 사용해 코드 블록에 구문 강조를 적용했다:

```typescript
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

  return posts.sort((a, b) =>
    new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
  );
}
```

라이트/다크 모드 모두에서 잘 동작하는 듀얼 테마를 적용했다.

## AI 에이전트와의 협업

이 블로그의 특별한 점은 **AI 에이전트와 함께 만들었다**는 것이다.

> 기획 문서 작성부터 디자인 시스템 설계, 코드 구현까지 — 사람이 방향을 잡고, AI가 실행을 돕는 워크플로우.

Product Brief, User Story, Design System 문서를 먼저 작성하고, 그 문서를 기반으로 코드를 작성했다. 문서가 곧 스펙이 되는 셈이다.

## 앞으로

- RSS 피드
- SEO 최적화 (메타태그, sitemap)
- 태그 시스템
- 더 많은 글
