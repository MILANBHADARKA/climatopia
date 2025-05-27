import { connectToDB } from "@/lib/mongodb"
import { getMockUserPosts, mockUsers } from "@/lib/mockData"
import Post from "@/models/Post"
import User from "@/models/User"
import { getUser } from "@/lib/getUser"

export async function GET(request) {
  try {
    // For development, use mock data

    // if (process.env.NODE_ENV === "development" || !process.env.MONGODB_URI) {
    //   const userId = "507f1f77bcf86cd799439011"
    //   const posts = getMockUserPosts(userId)
    //   const user = mockUsers.find((u) => u._id === userId)

    //   return Response.json({ posts, user })
    // }

    // Production code with MongoDB
    await connectToDB()

    const url = new URL(request.url)
    const urluserId = url.searchParams.get("id")
    // console.log("URL User ID:", urluserId)
    // console.log("Request URL:", request.url)

    let user = await getUser(request)
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    let userId = user._id

    if( urluserId ) {
      userId = urluserId
      user = await User.findById(userId).select("firstName lastName email").lean()
    }
    console.log("User ID:", userId)

    const posts = await Post.find({ author: userId }).populate("author", "firstName lastName email").sort({ createdAt: -1 }).lean()

    return Response.json({ posts, user })
  } catch (error) {
    console.error("Error fetching user posts:", error)
    return Response.json({ error: "Failed to fetch user posts" }, { status: 500 })
  }
}
