import os
import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.preprocessing import MinMaxScaler
from dotenv import load_dotenv
load_dotenv()
from LLM import run_climate_scenario_prediction
import cloudinary
from cloudinary.utils import cloudinary_url

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

csv_url = os.getenv("CLIMATE_CHANGE_IMPACT_ON_AGICULTURE_2024")
csvfile_url, _ = cloudinary_url(csv_url, resource_type="raw")

def load_model_and_data():
    base_path = os.path.dirname(__file__)
    file_path = csvfile_url
    model_path = os.path.join(base_path, 'pretrained_eco_xgb.json')

    df = pd.read_csv(file_path)

    all_features = [
        'Average_Temperature_C', 'Total_Precipitation_mm', 'CO2_Emissions_MT',
        'Crop_Yield_MT_per_HA', 'Pesticide_Use_KG_per_HA', 'Fertilizer_Use_KG_per_HA',
        'Soil_Health_Index', 'Economic_Impact_Million_USD'
    ]
    numeric_features = all_features
    data = df[numeric_features].values

    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(data)

    target_column = numeric_features.index('Economic_Impact_Million_USD')
    model = xgb.XGBRegressor()
    model.load_model(model_path)

    return model, scaler, scaled_data, target_column, numeric_features


def predict_eco(scenario: str) -> float:
    model, scaler, scaled_data, target_column, numeric_features = load_model_and_data()

    # Get features from LLM
    prediction = run_climate_scenario_prediction(scenario)

    # Format the features
    llm_input_features = np.array([
        prediction["meantemp"],
        prediction["Total_Precipitation_mm"],
        prediction["CO2_Emissions_MT"],
        prediction["Crop_Yield_MT_per_HA"],
        prediction["Pesticide_Use_KG_per_HA"],
        prediction["Fertilizer_Use_KG_per_HA"],
        prediction["Soil_Health_Index"]
    ]).reshape(1, -1)

    # Append a zero column for the target to match scaler input
    padded_input = np.hstack([llm_input_features, np.zeros((1, 1))])
    scaled_input = scaler.transform(padded_input)

    X_input = scaled_input[:, [i for i in range(len(numeric_features)) if i != target_column]]
    pred_scaled = model.predict(X_input)

    # Inverse scale the prediction
    full_output = np.zeros((1, scaled_data.shape[1]))
    full_output[:, target_column] = pred_scaled
    pred_rescaled = scaler.inverse_transform(full_output)[0, target_column]

    return round(pred_rescaled, 2)
