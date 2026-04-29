import multer, { type FileFilterCallback, type StorageEngine } from "multer";

const storage: StorageEngine = multer.memoryStorage();

const fileFilter = (
    req: Express.Request, 
    file: Express.Multer.File, 
    cb: FileFilterCallback
): void => {
    const allowedTypes: string[] = ["image/jpeg", "image/jpg", "image/png"];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Apenas arquivos JPEG, JPG e PNG são permitidos."));
    }
}

export const uploadAvatar = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
}).single("avatar");