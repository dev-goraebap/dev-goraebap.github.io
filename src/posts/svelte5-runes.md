---
title: 'Svelte 5 Runes: 반응성의 재설계'
description: '$state, $derived, $effect로 완전히 달라진 Svelte의 반응성 시스템. 기존 방식과 비교하며 Runes의 설계 철학과 실전 패턴을 정리합니다.'
date: '2026-03-08'
tags:
  - Svelte
  - Frontend
published: true
---

## 왜 Runes인가

Svelte 4까지의 반응성은 컴파일러 마법에 의존했다. `let count = 0`이라고 쓰면 컴파일러가 알아서 반응형으로 만들어줬다. 편리했지만, 어디서 반응성이 시작되고 끝나는지 명확하지 않았다.

## $state와 $derived

```svelte
<script>
	let count = $state(0);
	let doubled = $derived(count * 2);
</script>

<button onclick={() => count++}>
	{count} x 2 = {doubled}
</button>
```

Runes는 반응성을 **명시적**으로 만든다. `$state()`로 선언한 것만 반응형이고, `$derived()`로 파생 상태를 표현한다.

## $effect

```typescript
$effect(() => {
	console.log('count changed to ' + count);
	return () => console.log('cleanup');
});
```

사이드 이펙트를 선언적으로 관리한다. React의 useEffect와 비슷하지만 의존성 배열이 필요 없다. Svelte가 자동으로 추적한다.

## 마이그레이션 팁

기존 프로젝트를 Svelte 5로 옮길 때 가장 중요한 것은 `$props()` 전환이다. 기존 `export let`은 레거시 모드에서 계속 동작하지만, 새로운 패턴에 익숙해지는 것을 권장한다.

> [!NOTE]
> Svelte 5는 Svelte 4 코드와 **동일한 파일** 안에서 혼용이 가능하다. 레거시 모드와 Runes 모드를 점진적으로 전환할 수 있다.

> [!TIP]
> `$derived.by()`를 사용하면 여러 줄로 이루어진 복잡한 파생 상태도 깔끔하게 표현할 수 있다.

> [!WARNING]
> `$effect` 안에서 상태를 직접 변경하는 것은 무한 루프를 유발할 수 있다. 파생 상태가 필요하다면 `$derived`를 사용하자.

> [!CAUTION]
> Svelte 5는 아직 일부 서드파티 라이브러리와 호환성 문제가 있을 수 있다. 프로덕션 적용 전 충분한 테스트를 권장한다.
