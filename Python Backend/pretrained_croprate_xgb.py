import xgboost as xgb
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import pandas as pd
import os
from LLM import run_climate_scenario_prediction  # import your LLM function

# Scenario to simulate using LLM
scenario = "What if there is a global drought and CO2 levels increase drastically?"
llm_prediction = run_climate_scenario_prediction(scenario)

# File paths
base_path = os.path.dirname(__file__)
file_path = os.path.join(base_path, 'Datasets', 'climate_change_impact_on_agriculture_2024.csv')
model_path = os.path.join(base_path, 'pretrained_croprate_xgb.json')

# Load dataset
df = pd.read_csv(file_path)

# Define features (excluding 'Country')
all_features = ['Average_Temperature_C', 'Total_Precipitation_mm', 'CO2_Emissions_MT',
                'Crop_Yield_MT_per_HA', 'Pesticide_Use_KG_per_HA', 'Fertilizer_Use_KG_per_HA',
                'Soil_Health_Index', 'Economic_Impact_Million_USD']
numeric_features = [f for f in all_features if f != 'Country']
data = df[numeric_features].values

# Scale data
scaler = MinMaxScaler()
scaled_data = scaler.fit_transform(data)

# Define target and features
target_column = numeric_features.index('Crop_Yield_MT_per_HA')
X = scaled_data[:, [i for i in range(len(numeric_features)) if i != target_column]]
y = scaled_data[:, target_column]

# Train/test split
split = int(0.8 * len(X))
X_test, y_test = X[split:], y[split:]

# Load pretrained model
loaded_model = xgb.XGBRegressor()
loaded_model.load_model(model_path)

# Predict on test set
y_pred_scaled = loaded_model.predict(X_test)

# Inverse transform for comparison
y_pred_full = np.zeros((len(y_pred_scaled), scaled_data.shape[1]))
y_pred_full[:, target_column] = y_pred_scaled

y_test_full = np.zeros((len(y_test), scaled_data.shape[1]))
y_test_full[:, target_column] = y_test

y_pred_rescaled = scaler.inverse_transform(y_pred_full)[:, target_column]
y_test_rescaled = scaler.inverse_transform(y_test_full)[:, target_column]

print(f"🌾 Latest Predicted Crop Yield (Test Set): {y_pred_rescaled[-1]:.2f} MT/HA")

# =======================
# LLM Scenario Prediction
# =======================

# Extract feature values from LLM prediction (excluding target)
llm_input_features = np.array([
    llm_prediction['meantemp'],
    llm_prediction['Total_Precipitation_mm'],
    llm_prediction['CO2_Emissions_MT'],
    llm_prediction['Pesticide_Use_KG_per_HA'],
    llm_prediction['Fertilizer_Use_KG_per_HA'],
    llm_prediction['Soil_Health_Index'],
    llm_prediction['Economic_Impact_Million_USD']
]).reshape(1, -1)

# Sanity check for input feature size
assert llm_input_features.shape[1] == len(numeric_features) - 1, \
    "LLM input features must match the number of features excluding the target"

# Scale LLM input using the same scaler and correct feature order
llm_scaled_full = np.zeros((1, len(numeric_features)))
llm_input_index = 0  # Index for llm_input_features columns

for i, feature in enumerate(numeric_features):
    if feature != 'Crop_Yield_MT_per_HA':
        llm_scaled_full[0, i] = llm_input_features[0, llm_input_index]
        llm_input_index += 1

# Prepare input for model prediction (exclude target column)
llm_input_scaled = llm_scaled_full[:, [i for i in range(len(numeric_features)) if i != target_column]]

# Predict using the model
llm_pred_scaled = loaded_model.predict(llm_input_scaled)

# Inverse scale prediction to original units
llm_pred_full = np.zeros((1, scaled_data.shape[1]))
llm_pred_full[0, target_column] = llm_pred_scaled
llm_pred_rescaled = scaler.inverse_transform(llm_pred_full)[0, target_column]

print(f"🌍 Predicted Crop Yield under LLM Scenario: {llm_pred_rescaled:.2f} MT/HA")
