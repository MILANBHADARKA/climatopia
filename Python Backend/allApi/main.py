from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import nltk
from datetime import datetime
import os
import pandas as pd
from pyngrok import ngrok  # Add this import

# === NLTK Setup ===
NLTK_DATA_DIR = os.path.join(os.path.dirname(__file__), 'nltk_data')
nltk.data.path.append(NLTK_DATA_DIR)
sid = SentimentIntensityAnalyzer()

from pydantic import BaseModel

class ScenarioRequest(BaseModel):
    scenario: str

class PredictionRequest(BaseModel):
    start_time: str  # e.g., "2025-05-27T15:00:00"

class InputText(BaseModel):
    text: str

def get_sentiment(text):
    scores = sid.polarity_scores(text)
    compound = scores['compound']
    label = 'POSITIVE' if compound >= 0.05 else 'NEGATIVE' if compound <= -0.05 else 'NEUTRAL'
    return label, compound

# === Dataset Analysis (for offline use) ===
def analyze_dataset(input_csv, output_csv):
    df = pd.read_csv(input_csv)
    df = df.dropna(subset=['clean_text'])
    results = df['clean_text'].apply(get_sentiment)
    df['sentiment'], df['score'] = zip(*results)
    df.to_csv(output_csv, index=False)
    print(f"✅ Sentiment analysis complete. Results saved to: {output_csv}")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict_adaptation")
def predict_adaptation(scenario: ScenarioRequest):
    try:
        from classify import classify_adaptation  
        result = classify_adaptation(scenario.scenario)
        return {"success": True, "predicted_adaptation_strategy": result}
    except Exception as e:
        return {"success": False, "error": str(e)}
    
@app.post("/predict_croprate")
def get_prediction(payload: ScenarioRequest):
    try:
        from pretrained_croprate_xgb import predict_croprate
        result = predict_croprate(payload.scenario)
        return {"success": True, "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict_economic_impact")
def predict_economic_impact(request : ScenarioRequest):
    from pretrained_eco_xgb import predict_eco
    try:
        predicted_value = predict_eco(request.scenario)
        return {
            "message": "Prediction complete.",
            "scenario": request.scenario,
            "predicted_economic_impact_million_usd": predicted_value
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/predict_electricity")
def predict_electricity(request: PredictionRequest):
    from pretrained_electricity import electricity_demand_prediction  
    try:
        start_datetime = datetime.fromisoformat(request.start_time)
        fig = electricity_demand_prediction(start_datetime)
        return JSONResponse(content=fig)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post("/explain_whatif/")
async def explain_whatif_endpoint(scenario: ScenarioRequest):
    try:
        from explaination_agent import explain_planetary_what_if
        prediction = explain_planetary_what_if(scenario.scenario)
        return {"prediction": prediction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/geopolitial_impact/")
async def get_geopolitial_impact(scenario: ScenarioRequest):
    try:
        from geopolitics_agent import explain_geopolitical_what_if
        prediction = explain_geopolitical_what_if(scenario.scenario)
        return {"prediction": prediction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/ozone_prediction/")
async def predict_ozone_endpoint(scenario: ScenarioRequest):
    try:
        from pretrained_ozone_xgb import predict_ozone
        prediction = predict_ozone(scenario.scenario)
        return {"prediction": prediction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/humidity_prediction/")
async def predict_humidity(scenario: ScenarioRequest):
    try:
        from pretrained_humidity_xgb import predict_humidity
        prediction = predict_humidity(scenario.scenario)
        return {"prediction": prediction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/temperature-graph/")
async def graph_temperature():
    try:
        from pretrained_temp_lstm import predict_temp_lstm
        prediction = predict_temp_lstm()
        return {"prediction": prediction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/temperature_prediction/")
async def predict_temperature(scenario: ScenarioRequest):
    try:
        from pretrained_temp_xbg import predict_temp
        prediction = predict_temp(scenario.scenario)
        return {"prediction": prediction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/analyze_sentimental_report")
def analyze_text(data: InputText):
    sentiment, compound = get_sentiment(data.text)
    return {
        "text": data.text,
        "sentiment": sentiment,
        "score": compound
    }

if __name__ == "__main__":
    import uvicorn
    from pyngrok import ngrok
    
    # Set your ngrok authtoken here
    ngrok.set_auth_token("2xVJEPtRoeIWmpNPfnG5u1PjLk3_5iW4mZrUSjkDV42YM3Lfe")  # Replace with your actual ngrok auth token
    
    # Start ngrok tunnel
    http_tunnel = ngrok.connect(8000)
    print(f"Ngrok Tunnel URL: {http_tunnel.public_url}")
    
    # Run the FastAPI app with uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)