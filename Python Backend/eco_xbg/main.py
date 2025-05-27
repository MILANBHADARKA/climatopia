from fastapi import FastAPI, HTTPException
from pydantic import BaseModel


from pretrained_eco_xgb import predict_eco

app = FastAPI(title="Climate-Economic Impact Predictor")

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
