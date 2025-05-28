import mongoose from "mongoose"

const SavedWhatIfSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 200,
    },
    question: {
      type: String,
      required: true,
      trim: true,
      maxLength: 1000,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
      maxLength: 2000,
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    category: {
      type: String,
      enum: ["climate", "economy", "technology", "society", "environment", "other"],
      default: "other",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPosted: {
      type: Boolean,
      default: false,
    },
    postedAt: {
      type: Date,
      default: null,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better performance
SavedWhatIfSchema.index({ author: 1, createdAt: -1 })
SavedWhatIfSchema.index({ isPosted: 1 })
SavedWhatIfSchema.index({ category: 1 })

export default mongoose.models.SavedWhatIf || mongoose.model("SavedWhatIf", SavedWhatIfSchema)
