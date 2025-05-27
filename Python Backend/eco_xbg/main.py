from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


from pretrained_eco_xgb import predict_eco

app = FastAPI(title="Climate-Economic Impact Predictor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScenarioRequest(BaseModel):
    scenario: str

@app.post("/predict_economic_impact")
def predict_economic_impact(request : ScenarioRequest):
    try:
        predicted_value = predict_eco(request.scenario)
        return {
            "message": "Prediction complete.",
            "scenario": request.scenario,
            "predicted_economic_impact_million_usd": predicted_value
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
