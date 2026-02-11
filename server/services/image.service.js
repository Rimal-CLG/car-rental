import imagekit from "../configs/imageKit.js";
import fs from "fs";

export const uploadImageService = async (
  imageFile,
  folder,
  width
) => {
  const fileBuffer = fs.readFileSync(imageFile.path);

  const response = await imagekit.upload({
    file: fileBuffer,
    fileName: imageFile.originalname,
    folder,
  });

  const optimizedImageUrl = imagekit.url({
    path: response.filePath,
    transformation: [
      { width: width.toString() },
      { quality: "auto" },
      { format: "webp" },
    ],
  });

  return optimizedImageUrl;
};
