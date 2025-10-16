import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import * as path from 'path';
import {
  UploadedCreateFilesDto,
  UploadedUpdateFilesDto,
} from 'src/product/dto/uploaded-files.dto';
import { v4 } from 'uuid';

@Injectable()
export class FileService {
  constructor(private configService: ConfigService) {}

  async saveFiles(
    files: UploadedCreateFilesDto | UploadedUpdateFilesDto,
    entity: 'review' | 'product',
  ): Promise<{ avatarPath?: string; imagesPaths?: string[] }> {
    const uploadDir = this.configService.get<string>(
      entity === 'review' ? 'UPLOAD_REVIEW_PATH' : 'UPLOAD_PRODUCT_PATH',
    );
    const baseUrl = this.configService.get<string>('URL');

    if (!uploadDir || !baseUrl) {
      throw new ServiceUnavailableException(
        'Ошибка сервиса: не настроены пути',
      );
    }

    await this.ensureDirExists(uploadDir);

    let avatarPath: string | undefined;
    if (files.avatar && files.avatar.length > 0) {
      avatarPath = await this.saveFile(uploadDir, files.avatar[0]);
    }

    let imagesPaths: string[] | undefined;
    if (files.imgs && files.imgs.length > 0) {
      imagesPaths = await Promise.all(
        files.imgs.map((file) => this.saveFile(uploadDir, file)),
      );
    }

    return {
      avatarPath: avatarPath
        ? this.formatPublicUrl(baseUrl, uploadDir, avatarPath)
        : undefined,
      imagesPaths:
        imagesPaths && imagesPaths.length > 0
          ? imagesPaths.map((p) => this.formatPublicUrl(baseUrl, uploadDir, p))
          : undefined,
    };
  }

  private async saveFile(
    uploadDir: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const fileExt = path.extname(file.originalname);
    const fileName = `${v4()}${fileExt}`;
    const filePath = path.join(uploadDir, fileName);

    try {
      await fs.writeFile(filePath, file.buffer);
      return filePath;
    } catch (error) {
      if (error.code === 'EISDIR') {
        throw new ServiceUnavailableException(
          `Ошибка: путь ${filePath} является директорией, а не файлом`,
        );
      }
      throw error;
    }
  }

  private formatPublicUrl(
    baseUrl: string,
    uploadDir: string,
    filePath: string,
  ): string {
    const baseUploadsDir = path.dirname(uploadDir);
    const relativePath = path.relative(baseUploadsDir, filePath);
    const urlPath = relativePath.replace(/\\/g, '/');
    return `${baseUrl}/uploads/${urlPath}`;
  }

  private async ensureDirExists(dirPath: string): Promise<void> {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw new ServiceUnavailableException(
          `Не удалось создать директорию ${dirPath}`,
        );
      }
    }
  }

  async deleteFile(
    filePath: string,
    entity: 'review' | 'product',
  ): Promise<void> {
    try {
      console.log('deleteFile: Incoming filePath:', filePath);
      const uploadDir = this.configService.get<string>(
        entity === 'review' ? 'UPLOAD_REVIEW_PATH' : 'UPLOAD_PRODUCT_PATH',
      );
      console.log('deleteFile: uploadDir from config:', uploadDir);
      const baseUrl = this.configService.get<string>('URL');
      console.log('deleteFile: baseUrl from config:', baseUrl);

      if (!uploadDir || !baseUrl) {
        throw new ServiceUnavailableException(
          'Ошибка сервиса: не настроены пути',
        );
      }

      const relativePath = filePath.split(`${baseUrl}/uploads/`)[1];
      console.log('deleteFile: Extracted relativePath:', relativePath);
      if (!relativePath) {
        console.warn(
          `Не удалось извлечь относительный путь из URL: ${filePath}`,
        );
        return;
      }

      const fileName = path.basename(relativePath);
      const fullPath = path.join(uploadDir, fileName);
      console.log('deleteFile: Constructed fullPath for deletion:', fullPath);
      await fs.unlink(fullPath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.warn(`Файл не найден для удаления: ${filePath}`);
      } else {
        console.error(`Ошибка при удалении файла ${filePath}:`, error);
        throw new ServiceUnavailableException(
          `Не удалось удалить файл ${filePath}`,
        );
      }
    }
  }
}
