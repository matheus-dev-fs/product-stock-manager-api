import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { generateRandomFilename } from "../helpers/file.helper.js";

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

const AVATAR_SIZE: number = 50;
const AVATAR_DIR: string = path.join(__dirname, '../../public/avatars');

export const saveAvatar = async (fileBuffer: Buffer, originalname: string): Promise<string> => {
    await fs.mkdir(AVATAR_DIR, { recursive: true });

    const filename: string = generateRandomFilename(originalname);
    const filePath: string = path.join(AVATAR_DIR, filename);

    await sharp(fileBuffer)
        .resize(
            AVATAR_SIZE, 
            AVATAR_SIZE, { 
                fit: 'cover', position: 'center' 
            }
        )
        .toFile(filePath);

    return filename;
}

export const deleteAvatar = async (filename: string): Promise<void> => {
    if (!filename) {
        return;
    }

    const filePath: string = path.join(AVATAR_DIR, filename);
    await fs.unlink(filePath); 
}