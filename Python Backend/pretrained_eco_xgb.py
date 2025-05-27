import xgboost as xgb
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import pandas as pd
import os
from LLM import run_climate_scenario_prediction

# ====================================
# LLM-Based Scenario: User-defined
# ====================================
scenario = "What if climate-induced floods increase by 50% in Southeast Asia?"
prediction = run_climate_scenario_prediction(scenario)

# ====================================
# Load Dataset and Preprocess
# ====================================
base_path = os.path.dirname(__file__)  # folder of this script
file_path = os.path.join(base_path, 'Datasets', 'climate_change_impact_on_agriculture_2024.csv')
model_path = os.path.join(base_path, 'pretrained_eco_xgb.json')

df = pd.read_csv(file_path)

all_features = [
    'Average_Temperature_C', 'Total_Precipitation_mm', 'CO2_Emissions_MT',
    'Crop_Yield_MT_per_HA', 'Pesticide_Use_KG_per_HA', 'Fertilizer_Use_KG_per_HA',
    'Soil_Health_Index', 'Economic_Impact_Million_USD'
]

numeric_features = [f for f in all_features if f != 'Country']
data = df[numeric_features].values

scaler = MinMaxScaler()
scaled_data = scaler.fit_transform(data)

target_column = numeric_features.index('Economic_Impact_Million_USD')
X = scaled_data[:, [i for i in range(len(numeric_features)) if i != target_column]]
y = scaled_data[:, target_column]

# ====================================
# Split Data and Load Model
# ====================================
split = int(0.8 * len(X))
X_test, y_test = X[split:], y[split:]

loaded_model = xgb.XGBRegressor()
loaded_model.load_model(model_path)

# ====================================
# Predict on Test Set
# ====================================
y_pred_scaled = loaded_model.predict(X_test)

y_pred_full = np.zeros((len(y_pred_scaled), scaled_data.shape[1]))
y_pred_full[:, target_column] = y_pred_scaled

y_test_full = np.zeros((len(y_test), scaled_data.shape[1]))
y_test_full[:, target_column] = y_test

y_pred_rescaled = scaler.inverse_transform(y_pred_full)[:, target_column]
y_test_rescaled = scaler.inverse_transform(y_test_full)[:, target_column]

print(f"🧪 Predicted Economic Impact from Test Data: ${y_pred_rescaled[-1]:,.2f} Million USD")

# ====================================
# Predict with LLM Scenario
# ====================================
llm_input_features = np.array([
    prediction["meantemp"],
    prediction["Total_Precipitation_mm"],
    prediction["CO2_Emissions_MT"],
    prediction["Crop_Yield_MT_per_HA"],
    prediction["Pesticide_Use_KG_per_HA"],
    prediction["Fertilizer_Use_KG_per_HA"],
    prediction["Soil_Health_Index"]
]).reshape(1, -1)

# Scale LLM input
llm_scaled = scaler.transform(
    np.hstack([llm_input_features, np.zeros((1, 1))])  # placeholder for target
)

# Predict
llm_X = llm_scaled[:, [i for i in range(len(numeric_features)) if i != target_column]]
llm_pred_scaled = loaded_model.predict(llm_X)

# Rescale to original economic impact
llm_pred_full = np.zeros((1, scaled_data.shape[1]))
llm_pred_full[:, target_column] = llm_pred_scaled
llm_pred_rescaled = scaler.inverse_transform(llm_pred_full)[0, target_column]

print(f"🌍 Predicted Economic Impact with LLM Scenario: ${llm_pred_rescaled:,.2f} Million USD")
