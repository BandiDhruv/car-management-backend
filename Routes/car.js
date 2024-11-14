import express from "express";
import car from "../models/car.js"; // Add .js extension
import authMiddleware from "../middleware/authMiddleware.js"; // Add .js extension
import cloudinary from "cloudinary"
import { upload, uploadToCloudinary } from "../middleware/cloudinary.js";

const router = express.Router();

// Create a Car
router.post('/', authMiddleware, upload.array('images', 5), uploadToCloudinary, async (req, res) => {
    try {
      // Check if cloudinaryUrls are present
      const imageUrls = req.body.cloudinaryUrls;
      
      if (!imageUrls || imageUrls.length === 0) {
        return res.status(400).json({ message: 'No images uploaded to Cloudinary' });
      }
  
      // Create new car instance with Cloudinary URLs and other data
      const carr = new car({
        ...req.body,  // Title, description, tags, etc.
        images: imageUrls,  // Array of image URLs from Cloudinary
        userId: req.user._id,  // Assuming you're attaching userId from authMiddleware
      });
  
      // Save the car document to the database
      await carr.save();
      
      // Respond with the saved car data
      res.status(201).json(carr);
  
    } catch (error) {
      console.error('Error uploading images:', error);
      res.status(500).json({ message: 'Error uploading images' });
    }
  });
// List Cars
router.get('/', authMiddleware, async (req, res) => {
  const cars = await car.find({ userId: req.user._id });
  res.json(cars);
});

// Get Car Details
router.get('/:id', authMiddleware, async (req, res) => {
  const carr = await car.findById(req.params.id);
  res.json(carr);
});

// Update a Car
router.put('/:id', authMiddleware, async (req, res) => {
  const carr = await car.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(carr);
});

// Delete a Car
router.delete('/:id', authMiddleware, async (req, res) => {
  await car.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

export default router;
