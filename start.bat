@echo off
echo ===================================
echo  약국 QR 시스템 - 설치 및 실행
echo ===================================
echo.

REM Node.js 확인
node --version >nul 2>&1
if errorlevel 1 (
    echo [오류] Node.js가 설치되어 있지 않습니다.
    echo https://nodejs.org 에서 LTS 버전을 설치해주세요.
    pause
    exit /b 1
)

echo [1/2] 의존성 설치 중...
npm install

echo.
echo [2/2] 개발 서버 시작...
echo.
echo 브라우저에서 http://localhost:3000 을 열어주세요.
echo.
npm run dev
