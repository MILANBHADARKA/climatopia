import { getUser } from "@/lib/getUser"
import { connectToDB } from "@/lib/mongodb"
import Comment from "@/models/Comment"

export async function POST(request, { params }) {
  try {
    // For development, return mock response
    // if (process.env.NODE_ENV === "development" || !process.env.MONGODB_URI) {
    //   const liked = Math.random() > 0.5 // Random like/unlike
    //   const likesCount = Math.floor(Math.random() * 200) + 1

    //   return Response.json({
    //     liked,
    //     likesCount,
    //   })
    // }

    // Production code with MongoDB
    await connectToDB()

    const user = await getUser(request)
    if (!user) {
      return Response.json({ error: "User not authenticated" }, { status: 401 })
    }

    const userId = user._id
    // const post = await Post.findById(params.id)
    const commentId = params.commentid
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return Response.json({ error: "Comment not found" }, { status: 404 })
    }

    console.log("Comment found:", comment)
    console.log("Comment likes before toggle:", comment.likes)
    const existingLike = comment.likes.find((like) => like.user.toString() == userId)
    console.log("Existing like:", existingLike)
    console.log("User ID:", userId)

    if (existingLike) {
      comment.likes = comment.likes.filter((like) => like.user.toString() != userId)
      comment.likesCount = Math.max(0, comment.likesCount - 1)
    } else {
      comment.likes.push({ user: userId })
      comment.likesCount = comment.likesCount + 1
    }

    await comment.save()

    return Response.json({
      liked: !existingLike,
      likesCount: comment.likesCount,
    })
  } catch (error) {
    console.error("Error toggling like:", error)
    return Response.json({ error: "Failed to toggle like" }, { status: 500 })
  }
}
