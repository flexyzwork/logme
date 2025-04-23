# LM - EC2

이 프로젝트는 **EC2 환경에서 블루-그린 배포(Blue-Green Deployment)** 를 자동화하는 시스템입니다.
**Pulumi**를 사용하여 EC2 환경을 구축하며, **GitHub Actions**를 이용하여 배포를 자동화합니다.

---

## 🛠️ 시작하기 전에
### 0️⃣ 환경 변수 설정
```sh
cp .env.example .env 
```

---

## 🚀 로컬 실행 방법
### 0️⃣ 패키지 설치 및 빌드
```sh
pnpm install 
pnpm build
```

### 1️⃣ 개발 환경 실행
```sh
pnpm dev
```
이 명령어를 실행하면 Docker 컨테이너와 모든 애플리케이션이 실행됩니다.

### 2️⃣ 데이터베이스 마이그레이션 실행
```sh
pnpm db:init
```

### 3️⃣ 애플리케이션 접속
- 웹 클라이언트(Next.js): [http://localhost:3000](http://localhost:3000)
- API 서버(Express.js): [http://localhost:8001](http://localhost:8001)

#### 🚀 **API 테스트 방법**
1️⃣ `api-test.http` 파일을 VS Code에서 열기 \
2️⃣ **REST Client** 확장 프로그램 설치 (설치되지 않았다면) \
3️⃣ 요청 옆에 있는 “Send Request” 클릭 \
4️⃣ 🎉 API 요청 테스트 완료!

---

## 🔥 CI/CD 자동 배포
### 0️⃣ GitHub Actions 환경 변수 설정
```sh
cp .env.cicd.example .env.cicd
```

### 1️⃣ EC2 환경 구축 (Pulumi 자동화 실행)
```sh
pnpm infra:up
```
이 명령어를 실행하면 **EC2 인스턴스 및 네트워크 인프라가 자동으로 생성**됩니다.

### 2️⃣ 코드 변경 사항을 푸시하여 배포 실행
```sh
git add .
git commit -m "변경 사항"
git push
```
코드를 `push` 하면 **GitHub Actions가 자동으로 배포를 수행**합니다.

### 3️⃣ 배포 완료 후 도메인 확인
```sh
https://your.domain
```

### 4️⃣ EC2 환경 삭제
```sh
pnpm infra:down
```
이 명령어를 실행하면 **EC2 인스턴스 및 네트워크 인프라가 자동으로 삭제**됩니다.


---

## 📂 프로젝트 구조
```bash
lm-e2c-bg-deploy/
├── apps/
│   ├── client/            # Next.js 웹 애플리케이션
│   ├── server/            # Express.js API 서버
│   ├── nginx              # Nginx 서버
│
├── packages/              # 공통 패키지
│   ├── docker/            # 로컬 개발용 Docker 설정
│
├── infra/
│   ├── pulumi-aws         # Pulumi 기반 인프라 자동화
│
├── .github/workflows/      # CI/CD 자동화 (GitHub Actions)
├── README.md               # 프로젝트 문서
├── package.json            # Node.js 패키지 관리 파일
└── pnpm-lock.yaml          # 패키지 종속성 관리 파일
```

---

## 🔧 유용한 명령어
- `pnpm dev`: 개발 환경 실행
- `pnpm build`: 모든 패키지 및 애플리케이션 빌드
- `pnpm check-types`: 타입 검사 실행
- `pnpm db:reset`: 데이터베이스 초기화 및 마이그레이션 실행

---

<br >


## ✅ 블루-그린 배포 개요
GitHub Actions를 활용하여 **코드를 `push` 하면 자동으로 블루-그린 배포가 실행됩니다**.

### 💡 배포 흐름
1. 기존 프로덕션(Blue) 환경이 실행 중
2. 새로운 버전(Green)을 배포 후 테스트 진행
3. Green이 정상 동작하면 트래픽을 전환 (Blue → Green)
4. Blue 환경을 대기 상태로 유지 (롤백 대비)

### 🌍 Nginx 리버스 프록시 설정
Nginx는 두 개의 배포 환경을 관리하며, `/etc/nginx/sites-available/default` 설정을 통해 동작합니다.

```nginx
server {
    listen 80;
    location / {
        proxy_pass http://green-app;
    }
}
```

---

## ✅ CI/CD 자동화
### 📜 `.github/workflows/deploy.yml` 주요 내용
```yaml
name: Deploy to EC2
on:
  push:
    branches:
      - main
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: 코드 체크아웃
        uses: actions/checkout@v3

      - name: EC2에 배포 실행
        run: |
          ssh ubuntu@your-ec2-ip "cd /home/ubuntu/app && git pull origin main"
```
이 설정을 통해 **코드를 `push` 하면 자동으로 EC2에 배포**됩니다.

---

## 🛠️ 문제 해결 (Troubleshooting)
### 1️⃣ `docker-compose up` 실행 시 포트 충돌 오류
```sh
ERROR: Bind for 0.0.0.0:3000 failed: port is already allocated
```
✔ 해결 방법: 기존 컨테이너 중단 후 다시 실행
```sh
docker stop $(docker ps -q)
docker-compose up -d --build
```

### 2️⃣ EC2에서 GitHub 연결 문제
✔ 해결 방법: SSH 키 등록
```sh
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
cat ~/.ssh/id_rsa.pub
```
GitHub의 **Deploy Keys**에 추가 후 다시 시도.

---

## 🎯 결론
이 프로젝트는 **Pulumi를 이용해 EC2 환경을 자동화 구축하고, GitHub Actions로 블루-그린 배포를 실행하는 시스템**입니다.
추후 **Kubernetes(K8s) 또는 AWS ECS** 로 확장할 수 있도록 설계되었습니다. 🚀🔥

> 💡 **기여 및 문의**: 프로젝트 개선 제안이나 피드백이 있다면 언제든지 PR 또는 이슈를 등록해주세요!

