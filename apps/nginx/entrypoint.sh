#!/bin/sh

# 기본값 설정
: "${ACTIVE:=green}"

echo "🚀 Nginx 설정을 시작합니다."
echo "✅ ACTIVE: $ACTIVE"

# 환경 변수 적용하여 nginx.conf 생성
envsubst '$ACTIVE' < /etc/nginx/nginx.conf.template.ssl > /etc/nginx/nginx.conf

# Nginx를 포그라운드에서 실행
echo "🚀 Nginx 최종 실행..."
exec nginx -g 'daemon off;'