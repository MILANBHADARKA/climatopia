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

@app.post("/temperature_prediction/")
async def predict_temperature(scenario: str):
    try:
        from pretrained_temp_xbg import predict_temp
        prediction = predict_temp(scenario)
        return {"success" : True, "prediction": prediction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/temperature-graph/")
async def graph_temperature():
    try:
        from pretrained_temp_lstm import predict_temp_lstm
        prediction = predict_temp_lstm()
        return {"success" : True, "prediction": prediction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/humidity_prediction/")
async def predict_humidity(scenario: str):
    try:
        from pretrained_humidity_xgb import predict_humidity
        prediction = predict_humidity(scenario)
        return {"success" : True, "prediction": prediction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

