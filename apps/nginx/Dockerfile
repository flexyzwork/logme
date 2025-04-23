# Nginx 설치
FROM nginx:latest

# Certbot 설치
RUN apt-get update

# Nginx 설정 파일 및 엔트리포인트 복사
COPY nginx.conf.template.ssl /etc/nginx/nginx.conf.template.ssl
COPY entrypoint.sh /entrypoint.sh

# 권한 설정
RUN chmod +x /entrypoint.sh

# 엔트리포인트 설정
ENTRYPOINT ["/bin/sh", "/entrypoint.sh"]