---
title: 'TypeScript에서 패턴 매칭 구현하기'
description: 'ts-pattern 라이브러리를 활용한 타입 안전한 패턴 매칭. switch-case의 한계를 넘어 더 표현력 있는 분기 처리를 만드는 방법을 소개합니다.'
date: '2026-03-10'
tags:
  - TypeScript
  - 함수형 프로그래밍
published: true
---

## switch-case의 한계

TypeScript에서 복잡한 조건 분기를 다룰 때 switch-case는 금방 한계에 부딪힌다. 중첩된 조건, 타입 가드, exhaustive 체크까지 고려하면 코드는 순식간에 복잡해진다.

## ts-pattern 소개

```typescript
import { match, P } from 'ts-pattern';

type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rect'; w: number; h: number };

const area = (shape: Shape) =>
  match(shape)
    .with({ kind: 'circle' }, ({ radius }) => Math.PI * radius ** 2)
    .with({ kind: 'rect' }, ({ w, h }) => w * h)
    .exhaustive();
```

패턴 매칭은 데이터의 **구조**를 기반으로 분기한다. 단순한 값 비교가 아니라, 객체의 형태 자체가 조건이 된다.

## 실전 활용

API 응답 처리, 상태 머신, 폼 유효성 검사 등 다양한 곳에서 패턴 매칭은 코드의 가독성과 안전성을 높여준다.
