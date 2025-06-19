# Logme SaaS - Notion 기반 자동 블로그 생성 플랫폼

> **🚀 핵심 가치**: Notion 계정 연동만으로 개인 블로그가 자동 생성되는 SaaS 서비스
> **📅 개발 기간**: 2025.02 - 2025.03
> **🏗️ 아키텍처**: Turbo 모노레포 + Pulumi IaC + 블루-그린 배포

Notion 계정 연동 3단계만으로 개인 블로그가 자동 생성되는 SaaS 서비스입니다. Next.js 기반 빠른 MVP 개발과 Pulumi IaC를 통한 블루-그린 배포 자동화, 그리고 현대적인 모니터링 시스템을 구축하여 안정적인 서비스 운영을 실현했습니다.

---

## 🎯 **기술 선택 배경과 특징**

### **Next.js를 선택한 이유**
- **빠른 MVP 개발**: Pages Router → App Router 전환으로 개발 생산성 극대화
- **SSG/ISR 최적화**: 블로그 특성상 정적 생성과 점진적 재생성으로 성능 최적화
- **SEO 친화적**: 메타데이터 자동 생성 및 OG 이미지 동적 생성

### **Pulumi를 선택한 이유**
- **TypeScript 기반 IaC**: Terraform 대신 개발자 친화적 언어로 인프라 코드 작성
- **상태 관리 자동화**: 복잡한 상태 파일 관리 없이 인프라 버전 관리
- **원클릭 배포**: `pnpm infra:up/down`으로 전체 인프라 생성/삭제 가능

### **BullMQ + Redis를 선택한 이유**
- **안정적인 작업 큐**: 도메인 검증, 빌드 작업 등 비동기 처리 필수
- **실패 재시도**: 외부 API 호출 실패 시 자동 재시도 메커니즘
- **확장성**: 워커 인스턴스 수평 확장 가능

---

## 🛠️ **유지보수성을 고려한 설계**

### **모노레포 아키텍처**
```
apps/
├── web/          # Next.js 프론트엔드 (포트 3000)
├── api/          # NestJS 백엔드 (포트 4000)
├── worker/       # BullMQ 워커
└── nginx/        # 리버스 프록시

packages/
├── db/           # Prisma ORM + 스키마 관리
├── queue/        # BullMQ 래퍼 + 타입 정의
├── types/        # 공통 타입 정의
└── [설정 패키지들...]
```

### **타입 안전성 보장**
- **Prisma Schema**: 23개 모델로 복잡한 도메인 로직 타입 안전 관리
- **공통 타입 패키지**: `@repo/types`로 프론트엔드-백엔드 타입 일관성
- **Queue 타입 정의**: JobType enum과 JobData 제네릭으로 작업 큐 타입 안전성

### **클린 아키텍처 적용**
```typescript
// 의존성 주입 예시
@Injectable()
export class JobsService {
  async enqueueCheckDomain(data: CheckDomainDto) {
    const jobData = data as JobData[JobType.CheckDomain]
    return enqueue(JobType.CheckDomain, jobData, 60000)
  }
}
```

### **환경별 설정 분리**
- **개발환경**: `docker-compose.local.yaml`로 로컬 개발
- **프로덕션**: GitHub Actions + Docker 이미지 기반 배포
- **환경변수 템플릿**: `.env.example` 파일로 설정 가이드 제공

---

## 🚀 **성능 최적화와 대용량 트래픽 처리**

### **블루-그린 배포 자동화**
```yaml
# GitHub Actions 핵심 로직
- name: Determine Active Version
  run: |
    ACTIVE=$(ssh ec2 "docker ps --format '{{.Names}}' | grep -q 'app-blue' && echo blue || echo green")
    NEW=$([ "$ACTIVE" = "blue" ] && echo "green" || echo "blue")
```
- **무중단 서비스**: 현재 운영 중인 컨테이너 확인 후 반대 컬러로 배포
- **자동 롤백**: 헬스체크 실패 시 이전 버전으로 자동 복구
- **트래픽 전환**: Nginx 설정 동적 변경으로 Blue/Green 스위칭

### **현대적 모니터링 시스템**
```typescript
// Sentry 에러 추적
export function onRequestError(error: unknown, request: RequestInfo, errorContext: ErrorContext) {
  if (process.env.NODE_ENV === 'production') {
    import('@sentry/nextjs').then(Sentry => {
      Sentry.captureRequestError(error, request, errorContext);
    });
  }
}
```
- **BetterStack**: 서버 상태 실시간 모니터링
- **Sentry**: 애플리케이션 에러 추적 및 성능 분석
- **Slack 알림**: 장애 발생 시 5분 내 팀 알림

### **비동기 작업 처리로 성능 보장**
```typescript
export async function enqueue<T extends JobType>(type: T, data: JobData[T], delayMs?: number) {
  return queue.add(type, data, delayMs ? { delay: delayMs } : undefined)
}

export async function enqueueAndWait<T extends JobType>(type: T, data: JobData[T]) {
  const job = await enqueue(type, data)
  await job.waitUntilFinished(queueEvents)
  return job
}
```
- **도메인 검증**: 외부 API 호출을 워커에서 비동기 처리
- **빌드 작업**: Notion → Next.js 변환 작업을 큐로 분산 처리
- **백그라운드 작업**: 메인 서비스 성능에 영향 없이 무거운 작업 처리

---

## 🛠️ **기술 스택과 선택 이유**

| 분야 | 기술 | 선택 이유 |
|------|------|-----------|
| **Frontend** | Next.js 15, React 19 | App Router + SSG/ISR로 블로그 최적화 |
| **Backend** | NestJS, Prisma | IoC 컨테이너 + ORM으로 유지보수성 확보 |
| **Queue** | BullMQ, Redis | 안정적인 비동기 작업 처리 |
| **IaC** | Pulumi, AWS EC2 | TypeScript 기반 인프라 코드 |
| **CI/CD** | GitHub Actions, Docker | 블루-그린 배포 자동화 |
| **모니터링** | Sentry, BetterStack, Slack | 현대적 관측성 도구 |
| **인증** | NextAuth.js, JWT | 소셜 로그인 + 보안 토큰 |

---

## 📈 **달성한 성과**

| 항목 | 달성 결과 |
|------|-----------|
| **배포 자동화** | 수동 30분 → 자동 5분 (83% 단축) |
| **인프라 구축** | 수동 2시간 → 자동 10분 (92% 단축) |
| **장애 대응** | 24시간 → 5분 내 Slack 알림 |
| **서비스 안정성** | 무중단 배포 달성 (다운타임 0초) |
| **개발 생산성** | 모노레포로 코드 재사용성 67% 향상 |

---

## 🏗️ **시스템 아키텍처**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Notion API    │ -> │  GitHub Actions │ -> │   AWS EC2       │
│   (Content)     │    │   (CI/CD)       │    │  (Production)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
┌─────────────────────────────────────────────────────┼─────────────────┐
│                    Docker Compose                    │                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  ┌─────────────┐ │
│  │    Nginx    │  │  App-Blue   │  │ App-Green   │  │  │   Vector    │ │
│  │ (Port 80)   │  │ (Port 3001) │  │ (Port 3002) │  │  │ (Logging)   │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  │  └─────────────┘ │
│         │                                           │                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  ┌─────────────┐ │
│  │     API     │  │   Worker    │  │    Redis    │  │  │ PostgreSQL  │ │
│  │ (Port 4000) │  │  (BullMQ)   │  │   (Queue)   │  │  │ (Database)  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  │  └─────────────┘ │
└─────────────────────────────────────────────────────┼─────────────────┘
                                                      │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Sentry      │    │  BetterStack    │    │  Slack Webhook  │
│ (Error Track)   │    │ (Monitoring)    │    │ (Notifications) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🚀 **구현된 주요 기능**

### **핵심 기능**
- ✅ Notion API 연동으로 콘텐츠 자동 동기화
- ✅ GitHub/Google 소셜 로그인
- ✅ Next.js 블로그 자동 생성
- ✅ 도메인 연결 및 SSL 인증서 자동 발급
- ✅ 반응형 템플릿 시스템

### **고급 기능**
- ✅ **실시간 빌드 상태**: WebSocket으로 빌드 진행상황 실시간 확인
- ✅ **자동 OG 이미지**: 게시글별 동적 OG 이미지 생성
- ✅ **SEO 최적화**: 메타데이터 자동 생성 및 사이트맵
- ✅ **성능 모니터링**: Core Web Vitals 추적
- ✅ **에러 추적**: Sentry로 실시간 에러 모니터링

---

## 💡 **핵심 학습과 경험**

### **인프라 자동화 마스터**
- **Infrastructure as Code**: TypeScript로 AWS 리소스 관리
- **블루-그린 배포**: 무중단 서비스 제공 기술
- **컨테이너 오케스트레이션**: Docker Compose + 헬스체크

### **운영 가능한 시스템 구축**
- **관측성 도구**: Sentry + BetterStack + Vector 로그 수집
- **알림 시스템**: Slack 웹훅 연동으로 실시간 장애 대응
- **성능 추적**: Next.js 성능 메트릭 + 사용자 경험 지표

### **확장 가능한 아키텍처 설계**
- **모노레포 관리**: 여러 서비스와 패키지의 효율적 관리
- **비동기 처리**: BullMQ로 백그라운드 작업 분산
- **타입 안전성**: End-to-End 타입 안전성 보장

---

## 📚 **빠른 시작 가이드**

### **로컬 개발 환경**
```bash
# 1. 패키지 설치
pnpm install

# 2. 환경변수 설정
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local

# 3. 개발 서버 실행
pnpm dev

# 4. 데이터베이스 마이그레이션
pnpm db:init
```

### **프로덕션 배포**
```bash
# 1. 인프라 구축
pnpm infra:up

# 2. 코드 배포 (자동)
git push origin main

# 3. 인프라 삭제
pnpm infra:down
```

---

## 🔗 **프로젝트 링크**

- **🐙 GitHub**: [Repository](https://github.com/flexyzwork/logme)
- **📹 데모 영상**: [YouTube Playlist](https://www.youtube.com/playlist?list=PLhj0lww8svhBIM75YkGVFbAFkFshEI5Co)

---

## 🎯 **프로젝트의 가치**

이 프로젝트는 단순히 "동작하는 코드"를 넘어서 "실제 운영 가능한 시스템"을 구축하는 경험을 제공합니다.

**Notion 계정 연동 3단계**만으로 개인 블로그가 생성되는 사용자 경험 뒤에는, 복잡한 인프라 자동화와 모니터링 시스템, 그리고 무중단 배포 파이프라인이 숨어있습니다.

이러한 **기술적 복잡성을 사용자에게는 단순함으로** 제공하는 것이 이 프로젝트의 핵심 가치입니다.
