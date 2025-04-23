#!/bin/bash

# 현재 스크립트가 위치한 디렉토리 구하기
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# .env 로드
set -o allexport
# .env 파일 로드 (스크립트 기준 상대경로)
source "$SCRIPT_DIR/.env"
set +o allexport

echo "SERVER_IP: $SERVER_IP"
echo "SSH_KEY: $SSH_KEY"
echo "REMOTE_USER: $REMOTE_USER"
echo "LOCAL_CERT_PATH: $LOCAL_CERT_PATH"
echo "REMOTE_CERT_PATH: $REMOTE_CERT_PATH"

# SSH 호스트 키 제거 (기존 키 충돌 방지)
ssh-keygen -R "$SERVER_IP"

# 서버가 정상적으로 응답할 때까지 대기
echo "⌛ 서버 응답 대기 중..."
sleep 10

# 원격 서버의 certs 폴더에 대한 소유권 변경 (권한 문제 방지)
ssh -i "$SSH_KEY" "$REMOTE_USER@$SERVER_IP" "sudo mkdir -p $REMOTE_CERT_PATH && sudo chown -R $REMOTE_USER:$REMOTE_USER $REMOTE_CERT_PATH"

# rsync로 파일 동기화 (sudo 사용)
echo "🚀 rsync로 carts 동기화 중..."
rsync -avz -e "ssh -o StrictHostKeyChecking=no -i $SSH_KEY" "$LOCAL_CERT_PATH" "$REMOTE_USER@$SERVER_IP:$REMOTE_CERT_PATH" --rsync-path="sudo rsync"

echo "✅ carts 동기화 완료!"