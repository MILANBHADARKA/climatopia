import mongoose from "mongoose"

const SavedPostSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      maxLength: 500,
      default: "",
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better performance
SavedPostSchema.index({ author: 1, createdAt: -1 })
SavedPostSchema.index({ post: 1, author: 1 }, { unique: true }) // Prevent duplicate saves

export default mongoose.models.SavedPost || mongoose.model("SavedPost", SavedPostSchema)
