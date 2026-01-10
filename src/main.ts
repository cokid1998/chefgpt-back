import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    // 문서 페이지의 제목
    .setTitle("ChefGPT")
    // 문서에 대한 간략한 설명
    .setDescription("ChefGPT API 목록")
    // API의 버전 설정
    .setVersion("1.0")
    // 문서에서 API들을 그룹화할 태그
    // .addTag("test")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT 토큰을 입력하세요",
      },
      "access-token"
    )
    .build();

  // Swagger 문서 생성 함수 정의
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  // Swagger UI 엔드포인트 설정
  // '/api' 경로에 Swagger UI 인터페이스를 설정
  // 예: http://localhost:3000/api로 접속가능

  SwaggerModule.setup("api", app, documentFactory);

  app.enableCors({
    origin: "http://localhost:5173", // Todo: env로 가져오기
    credentials: true,
  });

  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
