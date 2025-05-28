import { GoogleGenAI, Modality } from "@google/genai";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export async function POST(request) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const redifined_prompt = prompt + "It is for whatif question image generation so for that generate image like imagination  ";

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: redifined_prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    // Find the image part in the response
    const imagePart = response.candidates[0].content.parts.find(
      part => part.inlineData
    );

    if (!imagePart) {
      return new Response(JSON.stringify({ error: "No image generated" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(imagePart.inlineData.data, "base64");

    // Upload to Cloudinary
    const cloudinaryResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "gemini-images" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      uploadStream.end(imageBuffer);
    });

    return new Response(JSON.stringify({ 
      imageUrl: cloudinaryResult.secure_url 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Error generating image:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to generate image" 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}