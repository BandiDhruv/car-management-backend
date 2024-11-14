import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import authRoutes from "./Routes/auth.js"
import carRoutes from "./Routes/car.js"
import dotenv  from "dotenv"
import cloudinary from "cloudinary"
// configDotenv()
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use(express.urlencoded({extended:true}));
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`)))
  .catch((error) => console.log(error));
