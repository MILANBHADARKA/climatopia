# main.py
from fastapi import FastAPI, HTTPException, Query
from typing import List
from pydantic import BaseModel
from datetime import datetime, timedelta
import pandas as pd
import xgboost as xgb
import os

app = FastAPI(title="Electricity Demand Predictor")

class DemandPoint(BaseModel):
    timestamp: str
    predicted_demand: float

class DemandResponse(BaseModel):
    start_datetime: str
    end_datetime: str
    peak: DemandPoint
    lowest: DemandPoint
    data: List[DemandPoint]

def load_model(model_path):
    model = xgb.XGBRegressor()
    model.load_model(model_path)
    return model

@app.get("/predict_electricity_demand", response_model=DemandResponse)
def predict_electricity_demand(start: str = Query(..., description="Start datetime in ISO format")):
    try:
        start_datetime = datetime.fromisoformat(start)
        end_datetime = start_datetime + timedelta(hours=24)

        dataset_path = os.path.join(os.path.dirname(__file__), 'Datasets', '2025 testset.csv')
        model_path = os.path.join(os.path.dirname(__file__), 'xgb_electricity_model.json')

        df = pd.read_csv(dataset_path, parse_dates=['timestamp'])

        df_24h = df[(df['timestamp'] >= start_datetime) & (df['timestamp'] < end_datetime)].copy()

        if df_24h.empty:
            raise HTTPException(status_code=404, detail="No data available for the selected time range.")

        df_24h['day_of_week'] = df_24h['timestamp'].dt.dayofweek
        df_24h['hour_of_day'] = df_24h['timestamp'].dt.hour
        df_24h['is_weekend'] = (df_24h['day_of_week'] >= 5).astype(int)

        features = ['day_of_week', 'hour_of_day', 'is_weekend', 'temperature', 'is_holiday', 'solar_generation']
        model = load_model(model_path)

        df_24h['predicted_demand'] = model.predict(df_24h[features])

        peak = df_24h.loc[df_24h['predicted_demand'].idxmax()]
        low = df_24h.loc[df_24h['predicted_demand'].idxmin()]

        return {
            "start_datetime": start_datetime.isoformat(),
            "end_datetime": end_datetime.isoformat(),
            "peak": {
                "timestamp": peak['timestamp'].isoformat(),
                "predicted_demand": float(peak['predicted_demand']),
            },
            "lowest": {
                "timestamp": low['timestamp'].isoformat(),
                "predicted_demand": float(low['predicted_demand']),
            },
            "data": [
                {"timestamp": row['timestamp'].isoformat(), "predicted_demand": float(row['predicted_demand'])}
                for _, row in df_24h.iterrows()
            ]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
