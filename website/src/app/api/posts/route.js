import {connectToDB} from "@/lib/mongodb"
import Post from "@/models/Post"
import { getMockPosts } from "@/lib/mockData"
import { getUser } from "@/lib/getUser"

export async function GET(request) {
  try {
    // For development, use mock data
    // if (process.env.NODE_ENV === "development" || !process.env.MONGODB_URI) {
    //   const { searchParams } = new URL(request.url)
    //   const filter = searchParams.get("filter") || "latest"
    //   const category = searchParams.get("category") || "all"
    //   const search = searchParams.get("search") || ""
    //   const page = Number.parseInt(searchParams.get("page")) || 1
    //   const limit = Number.parseInt(searchParams.get("limit")) || 10

    //   const posts = getMockPosts(filter, category, search)
    //   const startIndex = (page - 1) * limit
    //   const paginatedPosts = posts.slice(startIndex, startIndex + limit)

    //   return Response.json({
    //     posts: paginatedPosts,
    //     pagination: {
    //       page,
    //       limit,
    //       total: posts.length,
    //       pages: Math.ceil(posts.length / limit),
    //     },
    //   })
    // }

    // Production code with MongoDB
    await connectToDB()

    const { searchParams } = new URL(request.url)
    const filter = searchParams.get("filter") || "latest"
    const category = searchParams.get("category") || "all"
    const search = searchParams.get("search") || ""
    const page = Number.parseInt(searchParams.get("page")) || 1
    const limit = Number.parseInt(searchParams.get("limit")) || 10

    const query = { isPublic: true }

    if (category !== "all") {
      query.category = category
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { question: { $regex: search, $options: "i" } },
        { answer: { $regex: search, $options: "i" } },
      ]
    }

    let sortOptions = {}
    switch (filter) {
      case "popular":
        sortOptions = { likesCount: -1, createdAt: -1 }
        break
      case "trending":
        sortOptions = { createdAt: -1 } // Simplified for now
        break
      default:
        sortOptions = { createdAt: -1 }
    }

    const posts = await Post.find(query)
      .populate("author", "firstName lastName email")
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    const totalPosts = await Post.countDocuments(query)

    return Response.json({
      posts,
      pagination: {
        page,
        limit,
        total: totalPosts,
        pages: Math.ceil(totalPosts / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return Response.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData()
    const title = formData.get("title")
    const question = formData.get("question")
    const answer = formData.get("answer")
    const score = formData.get("score")
    const category = formData.get("category")
    const image = formData.get("image")

    if (!title || !question || !answer) {
      return Response.json({ error: "Title, question, and answer are required" }, { status: 400 })
    }

    // For development, return mock success
    // if (process.env.NODE_ENV === "development" || !process.env.MONGODB_URI) {
    //   const newPost = {
    //     _id: `mock_${Date.now()}`,
    //     title: title.trim(),
    //     question: question.trim(),
    //     answer: answer.trim(),
    //     score: score ? Number.parseInt(score) : undefined,
    //     category,
    //     image: image && image.size > 0 ? "/placeholder.svg?height=300&width=600" : null,
    //     author: {
    //       _id: "507f1f77bcf86cd799439011",
    //       name: "Dr. Sarah Chen",
    //       email: "sarah.chen@earthsim.ai",
    //     },
    //     likes: [],
    //     likesCount: 0,
    //     commentsCount: 0,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //     isPublic: true,
    //   }

    //   return Response.json({ post: newPost }, { status: 201 })
    // }

    // Production code with MongoDB
    await connectToDB()

    const user = await getUser(request);

    const userId = user ? user._id : null;

    if (!userId) {
      console.error("User not authenticated")
      
      return Response.json({ error: "User not authenticated" }, { status: 401 })
    }

    console.log("Creating post for user:", userId)
    

    let imageUrl = null
    if (image && image.size > 0) {
      imageUrl = "/placeholder.svg?height=300&width=600"
    }

    const post = new Post({
      title: title.trim(),
      question: question.trim(),
      answer: answer.trim(),
      score: score ? Number.parseInt(score) : undefined,
      category,
      image: imageUrl,
      author: userId,
    })

    await post.save()
    await post.populate("author", "firstName lastName email")

    return Response.json({ post }, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return Response.json({ error: "Failed to create post" }, { status: 500 })
  }
}
