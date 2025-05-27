# main.py
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import json

from pretrained_electricity import electricity_demand_prediction  

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    start_time: str  # e.g., "2025-05-27T15:00:00"

@app.post("/predict")
def predict_electricity(request: PredictionRequest):
    try:
        start_datetime = datetime.fromisoformat(request.start_time)
        fig = electricity_demand_prediction(start_datetime)
        return JSONResponse(content=fig)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
