import path from "path";

export const generateRandomFilename = (originalname: string): string => {
    const ext: string = path.extname(originalname);
    return `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
}