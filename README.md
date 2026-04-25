# 약국 QR 제품 조회 시스템

QR코드로 약국 제품 정보를 조회하고 관리하는 웹 시스템입니다.

## 페이지 구성

| URL | 설명 |
|-----|------|
| `/product/[id]` | 소비자용 제품 상세 페이지 (QR 스캔 시 연결) |
| `/admin/qr` | QR코드 생성 및 다운로드 |
| `/admin/products` | 제품 CRUD 관리 |

## 시작하기

### 1. Node.js 설치
https://nodejs.org 에서 LTS 버전 설치

### 2. 의존성 설치
```bash
cd C:\Users\pc\Desktop\pharmacy-qr
npm install
```

### 3. 로컬 실행
```bash
npm run dev
```
브라우저에서 http://localhost:3000 접속

### 4. 테스트
- http://localhost:3000/product/1 → 제품 1번 정보 확인
- http://localhost:3000/admin/qr → QR코드 생성
- http://localhost:3000/admin/products → 제품 관리

## Vercel 배포

```bash
npm install -g vercel
vercel
```

배포 후 `.env.local` 또는 Vercel 환경변수에서:
```
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

## 기술 스택
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL)
- qrcode 라이브러리
