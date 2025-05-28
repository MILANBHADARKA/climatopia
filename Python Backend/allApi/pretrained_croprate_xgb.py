# predictor.py

import xgboost as xgb
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import pandas as pd
import os
from LLM import run_climate_scenario_prediction

def predict_croprate(scenario: str) -> dict:
    llm_prediction = run_climate_scenario_prediction(scenario)

    base_path = os.path.dirname(__file__)
    file_path = os.path.join(base_path, 'Datasets', 'climate_change_impact_on_agriculture_2024.csv')
    model_path = os.path.join(base_path, 'pretrained_croprate_xgb.json')

    df = pd.read_csv(file_path)

    all_features = ['Average_Temperature_C', 'Total_Precipitation_mm', 'CO2_Emissions_MT',
                    'Crop_Yield_MT_per_HA', 'Pesticide_Use_KG_per_HA', 'Fertilizer_Use_KG_per_HA',
                    'Soil_Health_Index', 'Economic_Impact_Million_USD']
    numeric_features = [f for f in all_features if f != 'Country']
    data = df[numeric_features].values

    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(data)

    target_column = numeric_features.index('Crop_Yield_MT_per_HA')
    X = scaled_data[:, [i for i in range(len(numeric_features)) if i != target_column]]
    y = scaled_data[:, target_column]

    split = int(0.8 * len(X))
    X_test, y_test = X[split:], y[split:]

    loaded_model = xgb.XGBRegressor()
    loaded_model.load_model(model_path)

    y_pred_scaled = loaded_model.predict(X_test)

    y_pred_full = np.zeros((len(y_pred_scaled), scaled_data.shape[1]))
    y_pred_full[:, target_column] = y_pred_scaled

    y_test_full = np.zeros((len(y_test), scaled_data.shape[1]))
    y_test_full[:, target_column] = y_test

    y_pred_rescaled = scaler.inverse_transform(y_pred_full)[:, target_column]
    y_test_rescaled = scaler.inverse_transform(y_test_full)[:, target_column]

    llm_input_features = np.array([
        llm_prediction['meantemp'],
        llm_prediction['Total_Precipitation_mm'],
        llm_prediction['CO2_Emissions_MT'],
        llm_prediction['Pesticide_Use_KG_per_HA'],
        llm_prediction['Fertilizer_Use_KG_per_HA'],
        llm_prediction['Soil_Health_Index'],
        llm_prediction['Economic_Impact_Million_USD']
    ]).reshape(1, -1)

    assert llm_input_features.shape[1] == len(numeric_features) - 1

    llm_scaled_full = np.zeros((1, len(numeric_features)))
    llm_input_index = 0
    for i, feature in enumerate(numeric_features):
        if feature != 'Crop_Yield_MT_per_HA':
            llm_scaled_full[0, i] = llm_input_features[0, llm_input_index]
            llm_input_index += 1

    llm_input_scaled = llm_scaled_full[:, [i for i in range(len(numeric_features)) if i != target_column]]

    llm_pred_scaled = loaded_model.predict(llm_input_scaled)

    llm_pred_full = np.zeros((1, scaled_data.shape[1]))
    llm_pred_full[0, target_column] = llm_pred_scaled
    llm_pred_rescaled = scaler.inverse_transform(llm_pred_full)[0, target_column]

    return {
        "latest_test_crop_yield": round(float(y_pred_rescaled[-1]), 2),
        "llm_predicted_crop_yield": round(float(llm_pred_rescaled), 2),
        "llm_input": llm_prediction
    }
