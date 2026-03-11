---
title: 'Docker 멀티스테이지 빌드로 이미지 크기 90% 줄이기'
description: '프로덕션 Docker 이미지를 최적화하는 멀티스테이지 빌드 전략. Node.js 앱 기준 1.2GB에서 120MB로 줄인 실제 경험을 공유합니다.'
date: '2026-03-09'
tags:
  - Docker
  - DevOps
  - Node.js
published: true
---

## 문제: 비대한 프로덕션 이미지

개발 환경에서는 신경 쓰지 않던 이미지 크기가 프로덕션에선 직접적인 비용이 된다. CI/CD 파이프라인 속도, 컨테이너 시작 시간, 레지스트리 저장 비용까지.

## 멀티스테이지 빌드

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/main.js"]
```

핵심은 빌드에 필요한 도구와 런타임에 필요한 파일을 **분리**하는 것이다.

## 결과

빌드 도구, 소스 코드, devDependencies가 모두 제거된 깔끔한 프로덕션 이미지. 배포 속도와 보안 모두 개선된다.
