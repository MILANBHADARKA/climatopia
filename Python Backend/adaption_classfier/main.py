from fastapi import FastAPI, Request
from pydantic import BaseModel
from classify import classify_adaptation  

app = FastAPI()


class ScenarioRequest(BaseModel):
    scenario: str


@app.post("/predict_adaptation")
def predict_adaptation(data: ScenarioRequest):
    result = classify_adaptation(data.scenario)
    return {"predicted_adaptation_strategy": result}
