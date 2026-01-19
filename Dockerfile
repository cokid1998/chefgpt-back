FROM node:22-alpine AS builder

WORKDIR /app

# 의존성 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 애플리케이션 빌드
RUN npm run build

# 이미지 생성
FROM node:22-alpine

WORKDIR /app

# 빌드된 결과물 복사
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/nest-cli.json ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/tsconfig.build.json ./
COPY --from=builder /app/prisma.config.ts ./

# 애플리케이션 포트 노출
EXPOSE 3000

# 애플리케이션 실행
CMD ["node", "dist/main"]
