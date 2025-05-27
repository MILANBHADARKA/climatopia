import { getUser } from "@/lib/getUser"
import { connectToDB } from "@/lib/mongodb"
import Post from "@/models/Post"

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
    const post = await Post.findById(params.id)

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 })
    }

    const existingLike = post.likes.find((like) => like.user.toString() === userId)

    if (existingLike) {
      post.likes = post.likes.filter((like) => like.user.toString() !== userId)
      post.likesCount = Math.max(0, post.likesCount - 1)
    } else {
      post.likes.push({ user: userId })
      post.likesCount = post.likesCount + 1
    }

    await post.save()

    return Response.json({
      liked: !existingLike,
      likesCount: post.likesCount,
    })
  } catch (error) {
    console.error("Error toggling like:", error)
    return Response.json({ error: "Failed to toggle like" }, { status: 500 })
  }
}
