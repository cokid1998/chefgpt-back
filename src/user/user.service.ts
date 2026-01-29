import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { BadRequestException } from "@nestjs/common";
import { supabase, BUCKET_NAME } from "src/supabase/supabase";
import { UpdateUserInfoDto } from "src/user/dto/user.dto";
import bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async patchUserInfo(
    id: number,
    payload: UpdateUserInfoDto,
    thumbnailImageFile?: Express.Multer.File,
  ) {
    try {
      // 1. 사용자 확인
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });
      if (!user) {
        throw new BadRequestException("해당 유저를 찾을 수 없습니다.");
      }

      // 2. 썸네일 이미지 업로드
      let thumbnailUrl: string | undefined;
      if (thumbnailImageFile) {
        // Todo: 이미 저장된 썸네일이 있다면 삭제
        if (user.thumbnail) {
          // 1. thumbnail폴더 안 썸네일 이미지 목록
          const { data: files } = await supabase.storage
            .from(BUCKET_NAME)
            .list(`${user.id}/thumbnail`);

          // 2. 삭제할 경로
          const deleteThumbnailPath = files.map(
            (f) => `${user.id}/thumbnail/${f.name}`,
          );

          const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove(deleteThumbnailPath);
        }

        const fileExtension =
          thumbnailImageFile.originalname.split(".").pop() || "webp";
        const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;
        const filePath = `/${user.id}/thumbnail/${fileName}`;

        // supabase Storage에 사진 저장
        const { data, error: storageError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filePath, thumbnailImageFile.buffer, {
            contentType: thumbnailImageFile.mimetype,
          });

        if (storageError) throw storageError;

        // 저장한 이미지 url을 추출
        const { data: publicUrlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(data.path);

        thumbnailUrl = publicUrlData.publicUrl;
      }

      // 3. 비밀번호 해싱 (비밀번호 변경 시)
      let hashedPassword: string | undefined;
      if (payload.password) {
        hashedPassword = await bcrypt.hash(payload.password, 10);
      }

      // 4. 업데이트 데이터 정의
      const updateData = {
        ...(payload.nickname && { nickname: payload.nickname }),
        ...(hashedPassword && { password: hashedPassword }),
        ...(thumbnailUrl && { thumbnail: thumbnailUrl }),
      };

      // 5. DB 업데이트
      const updateUser = await this.prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          nickname: true,
          thumbnail: true,
          authProvider: true,
          createdAt: true,
        },
      });

      return updateUser;
    } catch (error) {
      throw new InternalServerErrorException(
        `사용자 정보 수정 중 오료가 발생 ${error.message}`,
      );
    }
  }

  async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException("해당 유저를 찾을 수 없습니다.");
    }

    return user;
  }
}
