from tensorflow.keras.models import model_from_json
from sklearn.preprocessing import MinMaxScaler
import numpy as np
import pandas as pd
import os
import matplotlib.pyplot as plt

# Set base path
base_path = os.path.dirname(__file__)
model_json_path = os.path.join(base_path, 'pretrained_lstm_model.json')

# Load model architecture
with open(model_json_path, 'r') as file:
    model_json = file.read()

loaded_model = model_from_json(model_json)

# Load weights
weights_path = os.path.join(base_path, "pretrained_lstm.weights.h5")
loaded_model.load_weights(weights_path)
print("✅ Model loaded and weights restored.")

# Compile model
loaded_model.compile(optimizer='adam', loss='mse', metrics=['mae'])

# Load new data
data_path = os.path.join(base_path, "Datasets", "DailyDelhiClimateTest.csv")
new_df = pd.read_csv(data_path)
new_df['date'] = pd.to_datetime(new_df['date'])
new_df.set_index('date', inplace=True)

features = ['meantemp', 'humidity', 'wind_speed', 'meanpressure']
new_data = new_df[features].values

# Fit scaler on new data
scaler = MinMaxScaler()
scaled_new_data = scaler.fit_transform(new_data)

# Sequence function
def create_sequences(data, window_size):
    X, y = [], []
    for i in range(len(data) - window_size):
        X.append(data[i:i + window_size])
        y.append(data[i + window_size, 0])
    return np.array(X), np.array(y)

window_size = 60
X_new, y_new = create_sequences(scaled_new_data, window_size)

# Predict
new_predictions_scaled = loaded_model.predict(X_new)

# Inverse transform predictions
new_predictions_full = np.zeros((len(new_predictions_scaled), scaled_new_data.shape[1]))
new_predictions_full[:, 0] = new_predictions_scaled[:, 0]
new_predictions = scaler.inverse_transform(new_predictions_full)[:, 0]

print(f"🌡️ Latest Predicted Temperature: {new_predictions[-1]:.2f}°C")

# Plot predictions for last 60 days
plt.figure(figsize=(12, 6))
plt.plot(new_df.index[window_size:], new_predictions, label='Predicted Temperature')
plt.plot(new_df.index[window_size:], new_df['meantemp'].values[window_size:], label='Actual Temperature', alpha=0.6)
plt.title('Temperature Prediction for Last 60+ Days')
plt.xlabel('Date')
plt.ylabel('Temperature (°C)')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()
