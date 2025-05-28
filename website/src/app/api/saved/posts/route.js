import {connectToDB} from "@/lib/mongodb"
import SavedPost from "@/models/SavedPost"
import { mockPosts } from "@/lib/mockData"
import { getUser } from "@/lib/getUser"


export async function GET(request) {
  try {
    // For development, use mock data


    // Production code with MongoDB
    await connectToDB()
    const user = await getUser(request);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }
    const userId = user._id;

    const savedPosts = await SavedPost.find({ author: userId })
      .populate({
        path: "post",
        populate: {
          path: "author",
          select: "firstName lastName email",
        },
      })
      .sort({ createdAt: -1 })
      .lean()

    return Response.json({ savedPosts })
  } catch (error) {
    console.error("Error fetching saved posts:", error)
    return Response.json({ error: "Failed to fetch saved posts" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { postId, notes } = await request.json()

    if (!postId) {
      return Response.json({ error: "Post ID is required" }, { status: 400 })
    }

    // For development, return mock response
    // if (process.env.NODE_ENV === "development" || !process.env.MONGODB_URI) {
    //   const mockPost = mockPosts.find((p) => p._id === postId) || mockPosts[0]
    //   const newSavedPost = {
    //     _id: `mock_saved_${Date.now()}`,
    //     post: mockPost,
    //     author: "507f1f77bcf86cd799439011",
    //     notes: notes || "",
    //     createdAt: new Date(),
    //   }

    //   return Response.json({ savedPost: newSavedPost }, { status: 201 })
    // }

    // Production code with MongoDB
    await connectToDB()


    const user = await getUser(request);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }
    const userId = user._id;

    // Check if already saved
    const existingSave = await SavedPost.findOne({ post: postId, author: userId })

    if (existingSave) {
      return Response.json({ error: "Post already saved" }, { status: 400 })
    }

    const savedPost = new SavedPost({
      post: postId,
      author: userId,
      notes: notes || "",
    })

    await savedPost.save()
    await savedPost.populate({
      path: "post",
      populate: {
        path: "author",
        select: "firstName lastName email",
      },
    })

    return Response.json({ savedPost }, { status: 201 })
  } catch (error) {
    console.error("Error saving post:", error)
    return Response.json({ error: "Failed to save post" }, { status: 500 })
  }
}
