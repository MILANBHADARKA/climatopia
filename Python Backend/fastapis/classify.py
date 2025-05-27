import xgboost as xgb
import numpy as np
from sklearn.preprocessing import MinMaxScaler, LabelEncoder
import pandas as pd
import os
from sklearn.metrics import classification_report
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

def classify_adaptation(scenario: str) -> str:
    """
    Classifies adaptation strategy based on a user-defined climate scenario.

    Args:
        scenario (str): The user-defined climate scenario description.

    Returns:
        str: The predicted adaptation strategy.
    """

    # ====================================
    # LLM-Based Scenario Input
    # ====================================
    prediction = run_climate_scenario_prediction(scenario)

    # ====================================
    # Paths
    # ====================================
    csvfile_url, _ = cloudinary_url(csv_url, resource_type="raw")
    base_path = os.path.dirname(__file__)
    file_path = csvfile_url
    print(f"Loading dataset from: {file_path}")
    model_path = os.path.join(base_path, 'pretrained_adaptation_classifier.json')

    # ====================================
    # Dataset & Label Encoding
    # ====================================
    df = pd.read_csv(file_path)
    label_encoder = LabelEncoder()
    df['Adaptation_Strategies_Encoded'] = label_encoder.fit_transform(df['Adaptation_Strategies'])

    feature_columns = [
        'Average_Temperature_C', 'Total_Precipitation_mm', 'CO2_Emissions_MT',
        'Crop_Yield_MT_per_HA', 'Pesticide_Use_KG_per_HA',
        'Fertilizer_Use_KG_per_HA', 'Soil_Health_Index'
    ]

    X_all = df[feature_columns].values
    y = df['Adaptation_Strategies_Encoded'].values

    # ====================================
    # Scaling & Test Split
    # ====================================
    scaler = MinMaxScaler()
    X_scaled = scaler.fit_transform(X_all)
    split = int(0.8 * len(X_scaled))
    X_test = X_scaled[split:]
    y_test = y[split:]

    # ====================================
    # Load Model
    # ====================================
    model = xgb.XGBClassifier()
    model.load_model(model_path)

    # ====================================
    # Evaluate on Test Data
    # ====================================
    y_pred = model.predict(X_test)
    y_pred_labels = label_encoder.inverse_transform(y_pred)
    y_test_labels = label_encoder.inverse_transform(y_test)

    print(f"🧪 Latest Predicted Adaptation Strategy (from test data): {y_pred_labels[-1]}")
    print(classification_report(y_test_labels, y_pred_labels))

    # ====================================
    # Predict LLM Scenario
    # ====================================
    input_features = np.array([
        prediction["meantemp"],
        prediction["Total_Precipitation_mm"],
        prediction["CO2_Emissions_MT"],
        prediction["Crop_Yield_MT_per_HA"],
        prediction["Pesticide_Use_KG_per_HA"],
        prediction["Fertilizer_Use_KG_per_HA"],
        prediction["Soil_Health_Index"]
    ]).reshape(1, -1)

    scaled_input = scaler.transform(input_features)
    encoded_pred = model.predict(scaled_input)
    final_strategy = label_encoder.inverse_transform(encoded_pred)[0]

    print(f"🌍 Predicted Adaptation Strategy (LLM Scenario): {final_strategy}")
    return final_strategy
