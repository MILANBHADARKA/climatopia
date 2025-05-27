import xgboost as xgb
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import pandas as pd
import os


base_path = os.path.dirname(__file__)  # folder of this script
file_path = os.path.join(base_path, 'Datasets', 'DailyDelhiClimateTrain.csv')

df = pd.read_csv(file_path)

df['date'] = pd.to_datetime(df['date'])
df.set_index('date', inplace=True)

features = ['meantemp', 'humidity', 'wind_speed', 'meanpressure']
data = df[features].values

scaler = MinMaxScaler()
scaled_data = scaler.fit_transform(data)

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

# Split again for prediction
split = int(0.8 * len(X))
X_test, y_test = X[split:], y[split:]


# Absolute path from current script location
base_path = os.path.dirname(__file__)
model_path = os.path.join(base_path, 'xgb_humidity_model.json')

loaded_model = xgb.XGBRegressor()
loaded_model.load_model(model_path)


# Predict
y_pred_scaled = loaded_model.predict(X_test)

# Inverse scale predicted values
y_pred_full = np.zeros((len(y_pred_scaled), scaled_data.shape[1]))
y_pred_full[:, target_column] = y_pred_scaled

y_test_full = np.zeros((len(y_test), scaled_data.shape[1]))
y_test_full[:, target_column] = y_test

y_pred_rescaled = scaler.inverse_transform(y_pred_full)[:, target_column]
y_test_rescaled = scaler.inverse_transform(y_test_full)[:, target_column]

# Final predicted value
print(f"Latest Predicted Humidity: {y_pred_rescaled[-1]:.2f}")
