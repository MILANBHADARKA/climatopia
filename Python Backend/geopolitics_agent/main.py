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


@app.post("/geopolitial_impact/")
async def get_geopolitial_impact(scenario: ScenarioRequest):
    try:
        from geopolitics_agent import explain_geopolitical_what_if
        prediction = explain_geopolitical_what_if(scenario.scenario)
        return {"prediction": prediction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

