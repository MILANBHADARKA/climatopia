import  { connectToDB } from "@/lib/mongodb"
import Post from "@/models/Post"
import Comment from "@/models/Comment"
import { getMockComments, mockUsers } from "@/lib/mockData"
import { getUser } from "@/lib/getUser"

export async function GET(request, { params }) {
  try {
    // For development, use mock data
    // if (process.env.NODE_ENV === "development" || !process.env.MONGODB_URI) {
    //   const comments = getMockComments(params.id)
    //   return Response.json({ comments })
    // }

    // Production code with MongoDB
    await connectToDB()

    const paramsId = await params.id
    if (!paramsId) {
      return Response.json({ error: "Post ID is required" }, { status: 400 })
    }

    // console.log("Fetching comments for post ID:", paramsId)

    const comments = await Comment.find({ post: paramsId })
      .populate("author", "firstName lastName email")
      .sort({ createdAt: -1 })
      .lean()

    return Response.json({ comments })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return Response.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(request, { params }) {
  try {
    const { content } = await request.json()

    if (!content || !content.trim()) {
      return Response.json({ error: "Comment content is required" }, { status: 400 })
    }

    // For development, return mock comment
    // if (process.env.NODE_ENV === "development" || !process.env.MONGODB_URI) {
    //   const newComment = {
    //     _id: `mock_comment_${Date.now()}`,
    //     content: content.trim(),
    //     author: mockUsers[0], // Default to first mock user
    //     post: params.id,
    //     likes: [],
    //     likesCount: 0,
    //     createdAt: new Date(),
    //   }

    //   return Response.json({ comment: newComment }, { status: 201 })
    // }

    // Production code with MongoDB
    await connectToDB()

    const user = await getUser(request)
    if (!user) {
      return Response.json({ error: "User not authenticated" }, { status: 401 })
    }

    const userId = user._id

    const comment = new Comment({
      content: content.trim(),
      author: userId,
      post: params.id,
    })

    await comment.save()
    await Post.findByIdAndUpdate(params.id, { $inc: { commentsCount: 1 } })

    const populatedComment = await Comment.findById(comment._id).populate("author", "firstName lastName email").lean()

    return Response.json({ comment: populatedComment }, { status: 201 })
  } catch (error) {
    console.error("Error creating comment:", error)
    return Response.json({ error: "Failed to create comment" }, { status: 500 })
  }
}
