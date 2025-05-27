# main.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from pretrained_croprate_xgb import predict_croprate

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScenarioRequest(BaseModel):
    scenario: str

@app.get("/")
def root():
    return {"message": "🌱 Crop Yield Predictor API is running!"}

@app.post("/predict_croprate")
def get_prediction(payload: ScenarioRequest):
    try:
        result = predict_croprate(payload.scenario)
        return {"success": True, "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
