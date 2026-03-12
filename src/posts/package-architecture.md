---
title: 패키지 디자인은 하나의 사고방식이다
description: 객체지향은 코드를 어떻게 설계할지 가르쳐줬지만, 패키지를 어떻게 나눌지는 가르쳐주지 않았어요. 그 빈자리를 채우기까지의 이야기예요.
date: 2026-03-12
tags: [architecture, backend, typescript, package-design]
cover: /covers/package-architecture.svg
published: true
---

국비지원 학원을 다니던 시절, 처음 배웠던 패키지 구조가 아직도 기억나요. `controllers`, `services`, `repositories` — 폴더 이름이 곧 아키텍처였죠. 그때는 이게 전부인 줄 알았어요.

몇 년이 지나고 프로젝트를 직접 설계하게 되면서, 이 단순해 보이는 선택이 생각보다 훨씬 많은 것을 결정한다는 걸 알게 됐어요. 이 글은 그 고민의 결과물이에요.

> [!NOTE]
> 이 글은 백엔드 웹 애플리케이션 관점의 이야기예요. 프론트엔드라면 [FSD(Feature-Sliced Design)](https://feature-sliced.design/kr/docs/get-started/overview)라는 훌륭한 가이드라인이 이미 존재해요.

## Type-Based vs Feature-Based

패키지를 구성하는 방식은 크게 두 가지로 나뉘어요.

### Type-Based: 계층이 곧 폴더

```
src/
├── controllers/
│   ├── user.controller.ts
│   └── post.controller.ts
├── services/
│   ├── user.service.ts
│   └── post.service.ts
└── repositories/
    ├── user.repository.ts
    └── post.repository.ts
```

장점은 명확해요. `controllers → services → repositories`라는 단방향 흐름이 폴더 구조 자체에서 드러나고, 의존성 방향을 문서화하지 않아도 자연스럽게 강제돼요. Ruby on Rails 같은 프레임워크가 이 방식을 여전히 고수하는 데는 이유가 있어요.

하지만 프로젝트가 커지면 문제가 드러나요. `services` 폴더 안에는 `UserService`, `PostService`, `OrderService`가 쌓이는데, 이 서비스들 사이에서도 역할 차이가 생겨요. 핵심 비즈니스 로직을 담당하는 서비스와, 여러 서비스를 오케스트레이션하는 서비스가 같은 폴더에 섞여요. 폴더 구조만 보고는 이 차이를 알 방법이 없어요.

### Feature-Based: 도메인이 곧 폴더

```
src/
├── user/
│   ├── user.controller.ts
│   ├── user.service.ts
│   └── user.repository.ts
├── post/
│   ├── post.controller.ts
│   ├── post.service.ts
│   └── post.repository.ts
└── ...
```

가장 큰 장점은 응집도예요. User 기능을 건드리려면 `user` 폴더만 열면 돼요. TypeScript라면 `index.ts`를 통한 Barrel Export로 외부에 공개할 API만 명시적으로 노출할 수도 있어요.

하지만 **패키지가 정말 독립적인지** 한번 확인해보세요.

ORM 엔티티를 예로 들면, `User` 엔티티가 `Post` 엔티티와 관계를 맺기 위해 다른 도메인 패키지를 import하고 있지 않나요? 서비스 간 참조를 막으려고 이벤트를 사용했다면, 이벤트 객체가 외부 패키지의 타입을 참조하고 있지 않나요?

진짜 완전히 격리하려면 코드 중복이 생기고, 그게 감당할 만한 비용인지도 따져봐야 해요. 명확한 규칙이 없다 보니, 어디까지 참조를 허용하고 어디서 막을지를 매번 고민해야 하는 것도 부담이에요.

## 레이어가 필요한 순간

프로젝트를 진행하다 보면 자연스럽게 이런 구조가 생겨요.

```
src/
├── user/
├── post/
├── order/
├── common/      ← 어느새 생김
├── database/    ← 어느새 생김
└── utils/       ← 어느새 생김
```

문제는 `user`, `post`, `order`는 Feature-Based 패키지인데, `common`, `database`, `utils`는 Type-Based 패키지라는 거예요. 같은 레벨에 있는 패키지들이 서로 다른 기준으로 나뉘어 있어요. 새로운 기능을 추가할 때 어디에 넣어야 할지 기준이 사라지죠.

여기서 **레이어(Layer)** 개념이 등장해요.

저는 FSD(Feature-Sliced Design)의 철학에서 아이디어를 빌려왔어요. FSD는 프론트엔드 아키텍처 방법론이지만, 패키지 구성에 대한 좋은 관점을 제공해요. 핵심은 이거예요.

> 소스코드 진입점 바로 아래의 패키지들을 **레이어**로 부르고, 레이어 간에는 명확한 참조 규칙을 둔다.

```
src/
├── app        // Level 4 — 최고수준
├── common     // Level 3
├── domain     // Level 2
└── shared     // Level 1 — 최저수준
```

규칙은 단순해요. **상위 레이어는 하위 레이어를 참조할 수 있고, 반대 방향은 안 돼요.** `app`은 모든 레이어를 참조할 수 있지만, `shared`는 아무것도 참조할 수 없어요.

### 레이어 내부 참조 규칙

같은 레이어 내 패키지끼리의 참조는 레이어 성격에 따라 다르게 적용해요.

```
app/           // 패키지 간 참조 금지 ❌
├── users/
├── posts/
└── admin/

shared/        // 패키지 간 참조 허용 ✓
├── utils/
├── config/
└── constants/
```

`app`처럼 고수준 레이어는 각 패키지가 독립적인 기능을 담당하므로 상호 참조를 금지해요. `shared`처럼 저수준 레이어는 재사용 가능한 공통 기능들이 협력하는 게 자연스러워요.

## 점진적으로 레이어를 분리하는 법

처음부터 완벽한 구조를 만들 필요는 없어요. 복잡도가 실제로 문제가 될 때 단계적으로 개선하면 돼요.

### 1단계: domain 레이어 분리

`app` 레이어 내부 패키지들이 서로를 참조하기 시작하면, 그 원인이 되는 것들을 `domain` 레이어로 꺼내요. ORM 엔티티, 도메인 모델, Repository 인터페이스, 다른 도메인에 의존하지 않는 핵심 서비스 등이 여기 해당해요.

```
src/
├── app/
│   ├── users/        // Controller + 오케스트레이션 Service
│   ├── posts/
│   └── admin/
├── domain/           // 새로 분리한 레이어
│   ├── user/
│   │   ├── user.entity.ts
│   │   ├── user.repository.ts   // 인터페이스
│   │   └── user-core.service.ts
│   └── post/
└── shared/
```

이렇게 분리하면 `app` 레이어에 **내부 패키지 간 참조 금지** 규칙을 적용할 수 있어요. 패키지 간에 공유해야 할 것들이 이미 `domain`으로 이동했으니까요.

또 다른 장점이 생겨요. `app` 레이어가 이제 API 리소스 구조를 명확하게 표현할 수 있어요.

```
app/
├── users/
├── posts/
├── auth/
├── admin/
│   ├── users/
│   ├── posts/
│   └── dashboard/
├── home/
└── feed/
```

패키지 구조만 봐도 "이 애플리케이션이 어떤 인터페이스를 제공하는가"가 한눈에 보여요.

> [!NOTE]
> 여기서 말하는 `domain` 레이어는 클린 아키텍처나 DDD의 "순수한 도메인 레이어"와는 달라요. Repository 구현체가 있어도 되고, ORM 엔티티를 직접 써도 돼요. 중요한 건 `app` 레이어에서 재사용 가능한 핵심 로직을 분리한다는 실용적인 목적이에요.

### 2단계: features 레이어 — 재사용되는 유즈케이스

`app` 레이어의 여러 패키지에서 같은 비즈니스 로직이 필요해지는 순간이 와요. 예를 들어 "게시글 작성" 기능이 일반 사용자 API(`/posts`)와 관리자 API(`/admin/posts`)에서 모두 필요한 경우요.

이 로직을 `domain`에 넣기엔 너무 상위 레벨의 비즈니스 흐름이고, `app`에 두자니 재사용이 안 돼요. 그래서 그 사이에 `features` 레이어를 둬요.

```
src/
├── app/
├── features/
│   ├── create-post/
│   │   ├── create-post.service.ts
│   │   └── create-post.dto.ts
│   ├── delete-user/
│   └── send-notification/
├── domain/
└── shared/
```

### 3단계: infra 레이어 — 외부 관심사 분리

`domain` 레이어를 보면 ORM 엔티티(도메인)와 Repository 구현체(인프라)가 함께 있어요. 이걸 분리하면 테스트가 쉬워지고, DB를 교체해도 도메인 레이어가 영향받지 않아요.

Repository 인터페이스는 `domain`에 두고, 구현체를 `infra`로 꺼내요. 의존성 역전(DIP)을 활용하면 `domain`은 `infra`를 알 필요가 없어요.

```
src/
├── app/
├── features/
├── domain/
│   └── user/
│       ├── user.entity.ts
│       └── user.repository.ts   // 인터페이스만
├── infra/
│   ├── repositories/
│   │   └── user.repository.impl.ts  // 구현체
│   └── queries/
│       └── post-query.service.ts    // 복잡한 조회 쿼리
└── shared/
```

의존성 방향은 `app → domain ← infra`가 돼요.

## 설계 원칙의 선택: 물리적 참조 vs 개념적 의존성

다른 개발자들과 이 구조를 놓고 토론하면서 흥미로운 관점 차이를 발견했어요.

### "DTO는 Presentation에 모여야 하지 않나요?"

타당한 지적이에요. DTO는 API 계약이니까 Presentation 레이어에서 일괄 관리하고, 다른 레이어들이 이를 참조하는 게 개념적으로 맞지 않냐는 거예요.

제 구조에서 이게 안 되는 이유가 있어요. `features`와 `infra`는 `app`보다 하위 레이어이므로 `app`을 참조할 수 없어요. 그래서 각 레이어가 자신의 기능에 필요한 DTO를 자체적으로 갖게 돼요.

이 차이의 본질은 **무엇을 우선시하느냐**에 있어요.

**물리적 참조 규칙 우선** — 패키지 간 실제 import 방향을 기본 원칙으로 삼아요. 레이어 참조 규칙이 명확하니 "이 코드가 어디로 가야 하는가"에 대한 답이 비교적 빠르게 나와요. 단점은 DTO가 여러 레이어에 분산된다는 거예요.

**개념적 의존성 우선** — 클린 아키텍처의 사상을 반영한 방식이에요. DTO를 'API 계약'이라는 추상으로 보고, Infrastructure가 이에 의존하는 구조예요. 개념적으로 각 요소가 논리적으로 적절한 위치에 있어요. 단점은 팀원마다 해석이 달라질 여지가 크다는 거예요.

둘 다 맞아요. 다만 **선택한 원칙을 일관되게 적용하는 것**이 중요해요.