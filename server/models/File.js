import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
  name: String,
  type: String,
  url: String,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("File", FileSchema);