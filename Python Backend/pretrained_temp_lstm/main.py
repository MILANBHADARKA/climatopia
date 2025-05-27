from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/temperature-graph/")
async def graph_temperature():
    try:
        from pretrained_temp_lstm import predict_temp_lstm
        prediction = predict_temp_lstm()
        return {"prediction": prediction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

