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
from pydantic import BaseModel
class ScenarioRequest(BaseModel):
    scenario: str



@app.post("/temperature_prediction/")
async def predict_temperature(scenario: ScenarioRequest):
    try:
        from pretrained_temp_xbg import predict_temp
        prediction = predict_temp(scenario.scenario)
        return {"prediction": prediction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

