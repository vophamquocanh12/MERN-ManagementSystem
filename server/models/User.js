import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String }, // optional
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "employee"],
    required: true,
    default: "employee"
  },
  profileImage: { type: String },

  // 🔁 Password reset fields
  resetToken: { type: String },
  resetTokenExpires: { type: Date },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// ✅ Automatically update updatedAt on save
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
