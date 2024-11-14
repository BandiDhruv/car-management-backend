import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  title: String,
  description: String,
  images: { type: [String], validate: [arrayLimit, 'Maximum 10 images'] },
  tags: [String],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

function arrayLimit(val) {
  return val.length <= 10;
}

export default mongoose.model('Car', carSchema);
