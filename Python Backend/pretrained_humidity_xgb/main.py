from fastapi import FastAPI, HTTPException
app = FastAPI()


@app.post("/humidity_prediction/")
async def predict_humidity(scenario: str):
    try:
        from pretrained_humidity_xgb import predict_humidity
        prediction = predict_humidity(scenario)
        return {"prediction": prediction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

