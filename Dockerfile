FROM node:22.16.0

WORKDIR /app

# 의존성 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 포트 노출
EXPOSE 3000

# 기본 명령어 (docker-compose에서 override됨)
CMD ["npm", "run", "start:dev"]