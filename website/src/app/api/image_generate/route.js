import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;
    
    // Here you would call your actual image generation API
    // For now, we'll simulate it with a placeholder
    // const response = await fetch('https://api.unsplash.com/photos/random', {
    //   headers: {
    //     'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
    //   }
    // });
    
    // const data = await response.json();
    
    res.status(200).json({ 
      url: prompt,
      alt: prompt 
    });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
}