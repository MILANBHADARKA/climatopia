
import { getUser } from "@/lib/getUser"
import { connectToDB } from "@/lib/mongodb"
import SavedWhatIf from "@/models/SavedWhatIf"

export async function GET(request) {
  try {
    // For development, use mock data

    // Production code with MongoDB
    await connectToDB()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || "all"
    const isPosted = searchParams.get("isPosted")

    const user = await getUser(request);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    const query = { author: user._id }

    if (category !== "all") {
      query.category = category
    }

    if (isPosted !== null) {
      query.isPosted = isPosted === "true"
    }

    const whatifs = await SavedWhatIf.find(query).sort({ createdAt: -1 }).lean()

    return Response.json({ whatifs })
  } catch (error) {
    console.error("Error fetching saved what-ifs:", error)
    return Response.json({ error: "Failed to fetch saved what-ifs" }, { status: 500 })
  }
}


export async function POST(request) {
  try {
    const { title, question, answer, score } = await request.json()
    await connectToDB()
    const user = await getUser(request);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    const SavedWhatIfQue = new SavedWhatIf({
      title, question, answer, score,
      author : user._id
    })

    await SavedWhatIfQue.save();
    return Response.json({ msg: "saved to whatif what-if" }, { status: 201 })

  } catch (error) {
    console.error("Error posting what-if:", error)
    return Response.json({ error: "Failed to saved what-if" }, { status: 500 })
  }
}