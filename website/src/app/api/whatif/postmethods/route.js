export async function POST(req) {
  const MAX_RETRIES = 5;
  const RETRY_DELAY_MS = 1000; // 1 second between retries
  
  try {
    const { scenario, api, start_time, text } = await req.json();

    // Prepare the request body
    let obj;
    if (scenario) {
      obj = { scenario };
    } else if (start_time) {
      obj = { start_time };
    } else if (text) {
      obj = { text };
    }

    let lastError = null;
    let attempt = 0;

    // Retry loop
    while (attempt < MAX_RETRIES) {
      try {
        attempt++;
        
        const apicall = await fetch(`${api}`, {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(obj)
        });

        // Check if the response was successful
        if (!apicall.ok) {
          throw new Error(`HTTP error! status: ${apicall.status}`);
        }

        const data = await apicall.json();
        return Response.json({ data });

      } catch (error) {
        lastError = error;
        console.error(`Attempt ${attempt} failed for ${api}:`, error.message);
        
        // Only delay if we're going to retry
        if (attempt < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        }
      }
    }

    // If we get here, all attempts failed
    console.error(`All ${MAX_RETRIES} attempts failed for ${api}`);
    return Response.json(
      { data : "2"}
    );

  } catch (error) {
    console.error('Unexpected error in POST handler:', error);
    return Response.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}