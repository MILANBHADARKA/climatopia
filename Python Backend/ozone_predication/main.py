from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
from pydantic import BaseModel
class ScenarioRequest(BaseModel):
    scenario: str


@app.post("/ozone_prediction/")
async def predict_ozone_endpoint(scenario: ScenarioRequest):
    try:
        from pretrained_ozone_xgb import predict_ozone
        prediction = predict_ozone(scenario.scenario)
        return {"prediction": prediction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

