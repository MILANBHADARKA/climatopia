import  { connectToDB } from "@/lib/mongodb"
import Post from "@/models/Post"
import { getMockUserStats } from "@/lib/mockData"
import { getUser } from "@/lib/getUser"

export async function GET(request) {
  try {
    // For development, use mock data
    // if (process.env.NODE_ENV === "development" || !process.env.MONGODB_URI) {
    //   const stats = getMockUserStats()
    //   return Response.json({ stats })
    // }

    // Production code with MongoDB
    await connectToDB()
    const url = new URL(request.url)
    const urluserId = url.searchParams.get("id")

    console.log("URL User ID:", urluserId)

    const user = await getUser(request)
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    const userId = urluserId || user._id
    console.log("User ID:", userId)
    const userPosts = await Post.find({ author: userId })

    const totalLikes = userPosts.reduce((sum, post) => sum + (post.likesCount || 0), 0)
    const totalComments = userPosts.reduce((sum, post) => sum + (post.commentsCount || 0), 0)

    const stats = {
      totalPosts: userPosts.length,
      totalLikes,
      totalComments,
    }

    return Response.json({ stats })
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return Response.json({ error: "Failed to fetch user stats" }, { status: 500 })
  }
}
