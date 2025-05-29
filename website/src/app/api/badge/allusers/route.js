import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getAllBadgesForUser } from "../badgeservice";
import axios from "axios";

export async function GET(request) {
  try {
    await connectToDB();

    const users = await User.find({}).select("firstName lastName email metamaskAddress").lean();
    
    // Process users sequentially to ensure proper async handling
    const userwithbadges = [];
    
    for (const user of users) {
      if (!user.metamaskAddress) continue;
      
      try {
        const badges = await getAllBadgesForUser(user.metamaskAddress);
        const fetchedImages = [];
        
        // Process badges sequentially to ensure all images are fetched
        for (const badge of badges) {
          try {
            const response = await axios.get(badge.url, { maxRedirects: 5 });
            if (response.data?.image) {
              fetchedImages.push({
                name: badge.name,
                image: response.data.image
              });
            }
          } catch (error) {
            console.error(`Error fetching badge from ${badge.url}:`, error.message);
          }
        }
        
        userwithbadges.push({
          id: user._id.toString(),
          name: `${user.firstName} ${user.lastName || ''}`.trim(),
          email: user.email,
          metamaskAddress: user.metamaskAddress,
          badges: fetchedImages,
          badgeCount: fetchedImages.length
        });
        
      } catch (error) {
        console.error(`Error processing user ${user._id}:`, error);
      }
    }

    // Sort users by badge count in descending order
    userwithbadges.sort((a, b) => b.badgeCount - a.badgeCount);

    console.log(userwithbadges)

    return Response.json(userwithbadges);

  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return Response.json(
      { error: "Failed to fetch leaderboard data" }, 
      { status: 500 }
    );
  }
}