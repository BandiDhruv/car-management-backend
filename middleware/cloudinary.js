import dotenv from 'dotenv';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';

dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer memory storage configuration
const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

// Middleware for uploading to Cloudinary
export const uploadToCloudinary = async (req, res, next) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return next(new Error('No files provided'));
    }

    const cloudinaryUrls = [];

    for (const file of files) {
      // Resize image using sharp
      const resizedBuffer = await sharp(file.buffer)
        .resize({ width: 800, height: 600 })
        .toBuffer();

      // Upload to Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'samples', // Adjust folder name
        },
        (err, result) => {
          if (err) {
            console.error('Cloudinary upload error:', err);
            return next(err);
          }

          if (!result) {
            console.error('Cloudinary upload error: Result is undefined');
            return next(new Error('Cloudinary upload result is undefined'));
          }

          cloudinaryUrls.push(result.secure_url);

          if (cloudinaryUrls.length === files.length) {
            // Once all files are uploaded, pass the URLs to the request body
            req.body.cloudinaryUrls = cloudinaryUrls;
            next();
          }
        }
      );

      uploadStream.end(resizedBuffer); // End the upload stream
    }
  } catch (error) {
    console.error('Error in uploadToCloudinary middleware:', error);
    next(error);
  }
};
