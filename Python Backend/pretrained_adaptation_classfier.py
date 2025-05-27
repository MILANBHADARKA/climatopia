import xgboost as xgb
import numpy as np
from sklearn.preprocessing import MinMaxScaler, LabelEncoder
import pandas as pd
import os
from sklearn.metrics import classification_report
from LLM import run_climate_scenario_prediction  # 👈 Make sure this returns feature dict

# ====================================
# LLM-Based Scenario: User-defined
# ====================================
scenario = "What adaptation strategy should be used if average temperature increases by 2°C with lower soil health?"
prediction = run_climate_scenario_prediction(scenario)  # must return a dict with model features

# ====================================
# File paths
# ====================================
base_path = os.path.dirname(__file__)
file_path = os.path.join(base_path, 'Datasets', 'climate_change_impact_on_agriculture_2024.csv')
model_path = os.path.join(base_path, 'pretrained_adaptation_classifier.json')

# ====================================
# Load Dataset and Encode Labels
# ====================================
df = pd.read_csv(file_path)

label_encoder = LabelEncoder()
df['Adaptation_Strategies_Encoded'] = label_encoder.fit_transform(df['Adaptation_Strategies'])

# Feature columns for input (no target or non-numeric cols)
feature_columns = [
    'Average_Temperature_C', 'Total_Precipitation_mm', 'CO2_Emissions_MT',
    'Crop_Yield_MT_per_HA', 'Pesticide_Use_KG_per_HA',
    'Fertilizer_Use_KG_per_HA', 'Soil_Health_Index'
]

X_all = df[feature_columns].values
y = df['Adaptation_Strategies_Encoded'].values

# ====================================
# Scale Features
# ====================================
scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X_all)

# Split last 20% as test set
split = int(0.8 * len(X_scaled))
X_test = X_scaled[split:]
y_test = y[split:]

# ====================================
# Load Pretrained Classifier
# ====================================
loaded_model = xgb.XGBClassifier()
loaded_model.load_model(model_path)

# ====================================
# Predict on Test Set
# ====================================
y_pred = loaded_model.predict(X_test)
y_pred_labels = label_encoder.inverse_transform(y_pred)
y_test_labels = label_encoder.inverse_transform(y_test)

# Output last prediction as example
print(f"🧪 Latest Predicted Adaptation Strategy (from test data): {y_pred_labels[-1]}")
print(classification_report(y_test_labels, y_pred_labels))

# ====================================
# Predict for LLM-Generated Scenario
# ====================================
# Order matters – match features
llm_input_features = np.array([
    prediction["meantemp"],                      # 'Average_Temperature_C'
    prediction["Total_Precipitation_mm"],        # 'Total_Precipitation_mm'
    prediction["CO2_Emissions_MT"],              # 'CO2_Emissions_MT'
    prediction["Crop_Yield_MT_per_HA"],          # 'Crop_Yield_MT_per_HA'
    prediction["Pesticide_Use_KG_per_HA"],       # 'Pesticide_Use_KG_per_HA'
    prediction["Fertilizer_Use_KG_per_HA"],      # 'Fertilizer_Use_KG_per_HA'
    prediction["Soil_Health_Index"]              # 'Soil_Health_Index'
]).reshape(1, -1)

# Scale input to match training
llm_input_scaled = scaler.transform(llm_input_features)

# Predict adaptation strategy
llm_pred_encoded = loaded_model.predict(llm_input_scaled)
llm_pred_label = label_encoder.inverse_transform(llm_pred_encoded)[0]

# ====================================
# Output LLM Scenario Result
# ====================================
print(f"🌍 Predicted Adaptation Strategy (LLM Scenario): {llm_pred_label}")
