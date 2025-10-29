import multer, { StorageEngine } from "multer";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import fs from "fs";
import path from "path";
import config from "../config";
import mime from "mime-types"; // optional for auto-detecting resource type

// ----------------------
// Cloudinary Configuration
// ----------------------
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name!,
  api_key: config.cloudinary.api_key!,
  api_secret: config.cloudinary.api_secret!,
});

// ----------------------
// Multer Configuration
// ----------------------
const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });

// ----------------------
// Cloudinary Upload Function
// ----------------------
export const uploadToCloudinary = async (
  filePath: string,
  resourceType?: "image" | "raw"
): Promise<{ url: string; public_id: string }> => {
  try {
    let type: "image" | "raw" = "image";
    if (resourceType) {
      type = resourceType;
    } else {
      const mimeType = mime.lookup(filePath) || "";
      type = mimeType.startsWith("image/") ? "image" : "raw";
    }

    const result: UploadApiResponse = await cloudinary.uploader.upload(filePath, {
      folder: "uploads",
      resource_type: type,
      type: "upload",
      access_mode: "public"
    });

    // Delete local file after successful upload
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    // Generate proper URL based on resource type
    let finalUrl = result.secure_url;
    
    if (type === "raw") {
      // For PDFs/raw files, add fl_attachment to make them downloadable
      finalUrl = cloudinary.url(result.public_id, {
        resource_type: "raw",
        flags: "attachment", // or use format-specific flags
        secure: true
      });
    }

    return {
      url: finalUrl,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    throw new Error("Cloudinary upload failed");
  }
};

// ----------------------
// Cloudinary Delete Function
// ----------------------
export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: "image" | "raw" = "image"
): Promise<{ success: boolean }> => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    console.log("File deleted from Cloudinary:", publicId);
    return { success: true };
  } catch (error) {
    console.error("❌ Cloudinary deletion failed:", error);
    return { success: false };
  }
};
