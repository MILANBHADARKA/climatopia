import xgboost as xgb
print("Loading XGBoost model for humidity prediction...")
import numpy as np
print("XGBoost model loaded successfully.")
from sklearn.preprocessing import MinMaxScaler
print("Loading MinMaxScaler for feature scaling...")
import pandas as pd
print("MinMaxScaler loaded successfully.")
import os
print("Loading LLM for climate scenario prediction...")
from LLM import run_climate_scenario_prediction
print("LLM loaded successfully.")
import cloudinary
from cloudinary.utils import cloudinary_url

print("Setting up Cloudinary for dataset access...")
# Set up your Cloudinary credentials
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)
print("Cloudinary configured successfully.")

csv_url = os.getenv("DailyDelhiClimateTrain")

def predict_humidity(scenario):

    prediction = run_climate_scenario_prediction(scenario)

    csvfile_url, _ = cloudinary_url(csv_url, resource_type="raw")

    # Load dataset
    base_path = os.path.dirname(__file__)  # folder of this script
    file_path = csvfile_url
    print(f"Loading dataset from: {file_path}")
    df = pd.read_csv(file_path)

    # Preprocess
    df['date'] = pd.to_datetime(df['date'])
    df.set_index('date', inplace=True)

    features = ['meantemp', 'humidity', 'wind_speed', 'meanpressure']
    data = df[features].values

    # Scale features
    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(data)

    # Create sequences for XGBoost
    def create_xgb_sequences(data, window_size, target_column):
        X, y = [], []
        for i in range(len(data) - window_size):
            window = data[i:i + window_size].flatten()
            X.append(window)
            y.append(data[i + window_size, target_column])
        return np.array(X), np.array(y)

    window_size = 30
    target_column = 1  # humidity
    X, y = create_xgb_sequences(scaled_data, window_size, target_column)

    # Train/test split
    split = int(0.8 * len(X))
    X_test, y_test = X[split:], y[split:]

    # Load the trained model
    model_path = os.path.join(base_path, 'xgb_temp_model.json')
    loaded_model = xgb.XGBRegressor()
    loaded_model.load_model(model_path)

    # Predict on test set
    y_pred_scaled = loaded_model.predict(X_test)

    # Rescale prediction
    y_pred_full = np.zeros((len(y_pred_scaled), scaled_data.shape[1]))
    y_pred_full[:, target_column] = y_pred_scaled

    y_test_full = np.zeros((len(y_test), scaled_data.shape[1]))
    y_test_full[:, target_column] = y_test

    # y_pred_rescaled = scaler.inverse_transform(y_pred_full)[:, target_column]
    # y_test_rescaled = scaler.inverse_transform(y_test_full)[:, target_column]

    # print(f"Latest Predicted Temperature from Test Data: {y_pred_rescaled[-1]:.2f}°C")

    # =======================
    # Use LLM Scenario Input
    # =======================

    # Extract LLM-based scenario input
    llm_input_features = np.array([
    prediction["meantemp"],
    prediction["humidity"],
    prediction["wind_speed"],
    prediction["meanpressure"]
    ]).reshape(1, -1)

    # Scale LLM input using same scaler
    llm_scaled = scaler.transform(llm_input_features)

    # Get the last sequence from the dataset
    last_sequence = scaled_data[-window_size:].flatten()

    # Construct new sequence by sliding and appending LLM input
    # (remove the oldest row, add the new LLM input)
    window_features = scaled_data[-window_size+1:]
    new_window = np.vstack([window_features, llm_scaled]).flatten()

    # Predict using the model with LLM scenario
    llm_pred_scaled = loaded_model.predict(new_window.reshape(1, -1))

    # Rescale the predicted temperature
    llm_pred_full = np.zeros((1, scaled_data.shape[1]))
    llm_pred_full[:, target_column] = llm_pred_scaled
    llm_pred_rescaled = scaler.inverse_transform(llm_pred_full)[0, target_column]

    print(f"🌞 Predicted Humidity with LLM Scenario : {llm_pred_rescaled:.2f}%")

    return {
        "predicted_humidity": llm_pred_rescaled,
        "original_scenario": scenario,
        "llm_prediction": prediction
    }

predict_humidity("What if earth becomes half lava")