import mongoose from "mongoose"

const PostSchema = new mongoose.Schema(
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
    image: {
      type: String, // URL to image
      default: null,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: String,
      enum: ["climate", "economy", "technology", "society", "environment", "other"],
      default: "other",
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better performance
PostSchema.index({ author: 1, createdAt: -1 })
PostSchema.index({ createdAt: -1 })
PostSchema.index({ likesCount: -1 })
PostSchema.index({ category: 1 })

export default mongoose.models.Post || mongoose.model("Post", PostSchema)
