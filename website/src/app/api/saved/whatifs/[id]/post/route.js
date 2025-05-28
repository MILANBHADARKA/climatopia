import {connectToDB} from "@/lib/mongodb"
import SavedWhatIf from "@/models/SavedWhatIf"
import Post from "@/models/Post"
import { getUser } from "@/lib/getUser"

export async function POST(request, { params }) {
  try {
    const { image, tags } = await request.json()

    // For development, return mock response
    // if (process.env.NODE_ENV === "development" || !process.env.MONGODB_URI) {
    //   const mockPost = {
    //     _id: `mock_post_${Date.now()}`,
    //     title: "Posted from saved what-if",
    //     question: "This was posted from a saved what-if",
    //     answer: "The answer from the saved what-if",
    //     score: 85,
    //     category: "technology",
    //     image: image || null,
    //     author: {
    //       _id: "507f1f77bcf86cd799439011",
    //       name: "Dr. Sarah Chen",
    //       email: "sarah.chen@earthsim.ai",
    //     },
    //     likes: [],
    //     likesCount: 0,
    //     commentsCount: 0,
    //     createdAt: new Date(),
    //     isPublic: true,
    //   }

    //   return Response.json({ post: mockPost }, { status: 201 })
    // }

    // Production code with MongoDB
    await connectToDB()

    const user = await getUser(request);

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    const id = await params.id;
    const userId = user._id;

    // Get the saved what-if
    const whatif = await SavedWhatIf.findById(id)

    if (!whatif) {
      return Response.json({ error: "What-if not found" }, { status: 404 })
    }

    if (whatif.isPosted) {
      return Response.json({ error: "What-if already posted" }, { status: 400 })
    }

    // Create a new post from the what-if
    const post = new Post({
      title: whatif.title,
      question: whatif.question,
      answer: whatif.answer,
      score: whatif.score,
      category: whatif.category,
      image: image || null,
      tags: tags || whatif.tags,
      author: userId,
    })

    await post.save()
    await post.populate("author", "firstName lastName email")

    // Update the what-if to mark it as posted
    whatif.isPosted = true
    whatif.postedAt = new Date()
    whatif.postId = post._id
    await whatif.save()

    return Response.json({ post }, { status: 201 })
  } catch (error) {
    console.error("Error posting what-if:", error)
    return Response.json({ error: "Failed to post what-if" }, { status: 500 })
  }
}
