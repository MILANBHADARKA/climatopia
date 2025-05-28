import { connectToDB } from "@/lib/mongodb"
import Post from "@/models/Post"
import Comment from "@/models/Comment"
import { getMockPost } from "@/lib/mockData"
import { getUser } from "@/lib/getUser"

export async function GET(request, { params }) {
  try {
    // For development, use mock data
    // if (process.env.NODE_ENV === "development" || !process.env.MONGODB_URI) {
    //   const post = getMockPost(params.id)
    //   if (!post) {
    //     return Response.json({ error: "Post not found" }, { status: 404 })
    //   }
    //   return Response.json({ post })
    // }

    // Production code with MongoDB
    await connectToDB()

    const paramsId = await params.id;

    if (!paramsId) {
      return Response.json({ error: "Post ID is required" }, { status: 400 })
    }

    const post = await Post.findById(paramsId).populate("author", "firstName lastName email").lean()

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 })
    }

    return Response.json({ post })
  } catch (error) {
    console.error("Error fetching post:", error)
    return Response.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    // For development, return success
    // if (process.env.NODE_ENV === "development" || !process.env.MONGODB_URI) {
    //   return Response.json({ message: "Post deleted successfully" })
    // }

    // Production code with MongoDB
    await connectToDB()

    const paramsId = await params.id;

    if (!paramsId) {
      return Response.json({ error: "Post ID is required" }, { status: 400 })
    }

    const post = await Post.findById(paramsId)
    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 })
    }

    const user = await getUser(request)
    if (!user || post.author.toString() !== user._id.toString()) {
      return Response.json({ error: "Unauthorized" }, { status: 403 })
    }

    await Comment.deleteMany({ post: params.id })
    await Post.findByIdAndDelete(params.id)

    return Response.json({ message: "Post deleted successfully" })
  } catch (error) {
    console.error("Error deleting post:", error)
    return Response.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
