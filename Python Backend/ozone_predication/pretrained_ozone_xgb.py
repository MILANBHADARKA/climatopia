import xgboost as xgb
import numpy as np
import pandas as pd
from datetime import datetime
import os
from LLM import run_climate_scenario_prediction


def predict_ozone(scenario):
    # ====================================
    # Use LLM to map scenario to input features
    # ====================================
    feature_dict = run_climate_scenario_prediction(scenario)

    # ====================================
    # Add Date-based Features
    # ====================================
    now = datetime.now()
    feature_dict["Month"] = now.month
    feature_dict["Day_of_month"] = now.day
    feature_dict["Day_of_week"] = now.weekday()  # Monday = 0

    input_features = ["Month", "Day_of_month", "Day_of_week", "pressure_height", "Temperature_Sandburg", 
                      "Temperature_ElMonte", "Inversion_base_height", "Pressure_gradient", "Inversion_temperature", "Visibility", "Wind_speed", "Humidity"]
    X_input = np.array([feature_dict[feat] for feat in input_features]).reshape(1, -1)

    # ====================================
    # Load pretrained XGBoost model
    # ====================================
    base_path = os.path.dirname(__file__)
    model_path = os.path.join(base_path, "xgb_ozone_model.json")

    model = xgb.XGBRegressor()
    model.load_model(model_path)

    # ====================================
    # Predict ozone reading
    # ====================================
    ozone_prediction = model.predict(X_input)[0]
    return float(ozone_prediction)


# Example usage
# scenario = "What if there's a sudden spike in vehicle emissions due to urban traffic in summer?"
# predict_ozone(scenario)
