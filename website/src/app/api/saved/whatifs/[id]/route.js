import { connectToDB } from "@/lib/mongodb"
import SavedWhatIf from "@/models/SavedWhatIf"

export async function GET(request, { params }) {
  try {
    // For development, use mock data
    // if (process.env.NODE_ENV === "development" || !process.env.MONGODB_URI) {
    //   const mockWhatIf = {
    //     _id: params.id,
    //     title: "Sample What If",
    //     question: "What if this was a real question?",
    //     answer: "This would be a real answer with detailed analysis.",
    //     score: 75,
    //     category: "technology",
    //     tags: ["sample", "test"],
    //     author: "507f1f77bcf86cd799439011",
    //     isPosted: false,
    //     createdAt: new Date(),
    //   }

    //   return Response.json({ whatif: mockWhatIf })
    // }

    // Production code with MongoDB
    await connectToDB()
    const id = await params.id;

    const whatif = await SavedWhatIf.findById(id).lean()

    if (!whatif) {
      return Response.json({ error: "What-if not found" }, { status: 404 })
    }

    return Response.json({ whatif })
  } catch (error) {
    console.error("Error fetching what-if:", error)
    return Response.json({ error: "Failed to fetch what-if" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { title, question, answer, score, category, tags } = await request.json()

    // For development, return mock response
    // if (process.env.NODE_ENV === "development" || !process.env.MONGODB_URI) {
    //   const updatedWhatIf = {
    //     _id: params.id,
    //     title: title.trim(),
    //     question: question.trim(),
    //     answer: answer.trim(),
    //     score: score || 0,
    //     category: category || "other",
    //     tags: tags || [],
    //     author: "507f1f77bcf86cd799439011",
    //     isPosted: false,
    //     updatedAt: new Date(),
    //   }

    //   return Response.json({ whatif: updatedWhatIf })
    // }

    // Production code with MongoDB
    await connectToDB()
    const id = await params.id;


    const whatif = await SavedWhatIf.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        question: question.trim(),
        answer: answer.trim(),
        score: score || 0,
        category: category || "other",
        tags: tags || [],
      },
      { new: true },
    ).lean()

    if (!whatif) {
      return Response.json({ error: "What-if not found" }, { status: 404 })
    }

    return Response.json({ whatif })
  } catch (error) {
    console.error("Error updating what-if:", error)
    return Response.json({ error: "Failed to update what-if" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    // For development, return success
    // if (process.env.NODE_ENV === "development" || !process.env.MONGODB_URI) {
    //   return Response.json({ message: "What-if deleted successfully" })
    // }
    const id = await params.id;

    // Production code with MongoDB
    await connectToDB()

    const whatif = await SavedWhatIf.findByIdAndDelete(id)

    if (!whatif) {
      return Response.json({ error: "What-if not found" }, { status: 404 })
    }

    return Response.json({ message: "What-if deleted successfully" })
  } catch (error) {
    console.error("Error deleting what-if:", error)
    return Response.json({ error: "Failed to delete what-if" }, { status: 500 })
  }
}
