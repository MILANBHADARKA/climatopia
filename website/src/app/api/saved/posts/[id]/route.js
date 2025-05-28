import {connectToDB} from "@/lib/mongodb"
import SavedPost from "@/models/SavedPost"

export async function DELETE(request, { params }) {
  try {
    // For development, return success
    // if (process.env.NODE_ENV === "development" || !process.env.MONGODB_URI) {
    //   return Response.json({ message: "Saved post removed successfully" })
    // }

    // Production code with MongoDB
    await connectToDB()
    const id = await params.id;

    const savedPost = await SavedPost.findByIdAndDelete(id)

    if (!savedPost) {
      return Response.json({ error: "Saved post not found" }, { status: 404 })
    }

    return Response.json({ message: "Saved post removed successfully" })
  } catch (error) {
    console.error("Error removing saved post:", error)
    return Response.json({ error: "Failed to remove saved post" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { notes } = await request.json()

    // // For development, return mock response
    // if (process.env.NODE_ENV === "development" || !process.env.MONGODB_URI) {
    //   return Response.json({
    //     savedPost: {
    //       _id: params.id,
    //       notes: notes || "",
    //       updatedAt: new Date(),
    //     },
    //   })
    // }

    // Production code with MongoDB
    await connectToDB()
    
    const id = await params.id;

    const savedPost = await SavedPost.findByIdAndUpdate(id, { notes: notes || "" }, { new: true }).populate({
      path: "post",
      populate: {
        path: "author",
        select: "firstName lastName email",
      },
    })

    if (!savedPost) {
      return Response.json({ error: "Saved post not found" }, { status: 404 })
    }

    return Response.json({ savedPost })
  } catch (error) {
    console.error("Error updating saved post:", error)
    return Response.json({ error: "Failed to update saved post" }, { status: 500 })
  }
}
