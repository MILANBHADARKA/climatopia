# -*- coding: utf-8 -*-
"""TimeSeries-TemperaturePrediction.ipynb

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/drive/1WABcDXR7uf17s23CpPhavWjRSm_b7tRC
"""


import pandas as pd
import numpy as np
import plotly.graph_objects as go
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
import os

base_path = os.path.dirname(__file__)  # folder of this script
file_path = os.path.join(base_path, 'Datasets', 'DailyDelhiClimateTrain.csv')

df = pd.read_csv(file_path)
df['date'] = pd.to_datetime(df['date'])
df.set_index('date', inplace=True)

# Use multiple features
features = ['meantemp', 'humidity', 'wind_speed', 'meanpressure']
data = df[features].values

# Scale data
scaler = MinMaxScaler()
scaled_data = scaler.fit_transform(data)

# Create sequences
def create_sequences(data, window_size):
    X, y = [], []
    for i in range(len(data) - window_size):
        X.append(data[i:i + window_size])
        y.append(data[i + window_size, 0])  # predict meantemp only
    return np.array(X), np.array(y)

window_size = 60  # longer window (60 days)
X, y = create_sequences(scaled_data, window_size)

# Train-test split
split = int(0.8 * len(X))
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]

# Build improved LSTM model
model = Sequential([
    LSTM(128, return_sequences=True, input_shape=(window_size, len(features))),
    Dropout(0.2),
    LSTM(64),
    Dense(32, activation='relu'),
    Dense(1)
])

model.compile(optimizer='adam', loss='mse', metrics=['mae'])

# Callbacks
early_stop = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
reduce_lr = ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=5)

# Train model
history = model.fit(
    X_train, y_train,
    validation_data=(X_test, y_test),
    epochs=50,
    batch_size=16,
    callbacks=[early_stop, reduce_lr],
    verbose=1
)

# Predict on test data
y_pred_scaled = model.predict(X_test)

# Expand predictions and actuals for inverse transform
y_pred_full = np.zeros((len(y_pred_scaled), scaled_data.shape[1]))
y_pred_full[:, 0] = y_pred_scaled[:, 0]

y_test_full = np.zeros((len(y_test), scaled_data.shape[1]))
y_test_full[:, 0] = y_test  # FIXED: y_test is 1D

# Inverse transform
y_pred_rescaled = scaler.inverse_transform(y_pred_full)[:, 0]
y_test_rescaled = scaler.inverse_transform(y_test_full)[:, 0]

# Dates for plotting
test_dates = df.index[-len(y_test_rescaled):]

# Calculate metrics
mse = mean_squared_error(y_test_rescaled, y_pred_rescaled)
mae = mean_absolute_error(y_test_rescaled, y_pred_rescaled)
rmse = np.sqrt(mse)
r2 = r2_score(y_test_rescaled, y_pred_rescaled)

print(f"Mean Squared Error (MSE): {mse:.2f}")
print(f"Root Mean Squared Error (RMSE): {rmse:.2f}")
print(f"Mean Absolute Error (MAE): {mae:.2f}")
print(f"R² Score: {r2:.4f}")

# Create interactive plot
fig = go.Figure()

# Actual temperatures
fig.add_trace(go.Scatter(
    x=test_dates,
    y=y_test_rescaled,
    mode='lines+markers',
    name='Actual Temperature',
    line=dict(color='blue'),
    hovertemplate='Date: %{x}<br>Actual: %{y:.2f}°C'
))

# Predicted temperatures
fig.add_trace(go.Scatter(
    x=test_dates,
    y=y_pred_rescaled,
    mode='lines+markers',
    name='Predicted Temperature',
    line=dict(color='red'),
    hovertemplate='Date: %{x}<br>Predicted: %{y:.2f}°C'
))

# Add annotation for latest predicted value
fig.add_annotation(
    x=test_dates[-1],
    y=y_pred_rescaled[-1],
    text=f"Latest Prediction: {y_pred_rescaled[-1]:.2f}°C",
    showarrow=True,
    arrowhead=2,
    ax=-40,
    ay=-40,
    bgcolor="yellow"
)

# Figure layout
fig.update_layout(
    title='Enhanced LSTM Predictions on Delhi Climate Training Data',
    xaxis_title='Date',
    yaxis_title='Mean Temperature (°C)',
    legend=dict(x=0, y=1),
    hovermode='x unified'
)

# Show plot
# fig.show()

# Print last predicted value
print(f"Latest Predicted Temperature: {y_pred_rescaled[-1]:.2f}°C")



import pandas as pd
import numpy as np
import plotly.graph_objects as go
import os

base_path = os.path.dirname(__file__)  # folder of this script
file_path = os.path.join(base_path, 'Datasets', 'DailyDelhiClimateTest.csv')

new_df = pd.read_csv(file_path)

new_df['date'] = pd.to_datetime(new_df['date'])
new_df.set_index('date', inplace=True)

# Include all 4 features
new_data = new_df[['meantemp', 'humidity', 'wind_speed', 'meanpressure']].values

# Scale using the SAME scaler (do NOT fit again!)
scaled_new_data = scaler.transform(new_data)

# Reuse the sequence creation function
def create_sequences(data, window_size):
    X, y = [], []
    for i in range(len(data) - window_size):
        X.append(data[i:i + window_size])
        y.append(data[i + window_size, 0])  # we only care about meantemp
    return np.array(X), np.array(y)

X_new, y_new = create_sequences(scaled_new_data, window_size)

# Predict
new_predictions_scaled = model.predict(X_new)

# Expand predictions for inverse transform
new_predictions_full = np.zeros((len(new_predictions_scaled), scaled_new_data.shape[1]))
new_predictions_full[:, 0] = new_predictions_scaled[:, 0]

# Inverse transform
new_predictions = scaler.inverse_transform(new_predictions_full)[:, 0]

# Actual meantemp for comparison
actual_meantemp = new_data[window_size:, 0]  # drop first window_size

# Dates for plotting
predicted_dates = new_df.index[window_size:]  # skip initial window

# Create interactive plot
fig = go.Figure()

# Actual temperatures
fig.add_trace(go.Scatter(
    x=predicted_dates,
    y=actual_meantemp,
    mode='lines+markers',
    name='Actual Temperature',
    line=dict(color='blue'),
    hovertemplate='Date: %{x}<br>Actual: %{y:.2f}°C'
))

# Predicted temperatures
fig.add_trace(go.Scatter(
    x=predicted_dates,
    y=new_predictions,
    mode='lines+markers',
    name='Predicted Temperature',
    line=dict(color='red'),
    hovertemplate='Date: %{x}<br>Predicted: %{y:.2f}°C'
))

# Add annotation for latest predicted value
fig.add_annotation(
    x=predicted_dates[-1],
    y=new_predictions[-1],
    text=f"Latest Prediction: {new_predictions[-1]:.2f}°C",
    showarrow=True,
    arrowhead=2,
    ax=-40,
    ay=-40,
    bgcolor="yellow"
)

# Figure layout
fig.update_layout(
    title='LSTM Predictions on Temperature',
    xaxis_title='Date',
    yaxis_title='Mean Temperature (°C)',
    legend=dict(x=0, y=1),
    hovermode='x unified'
)

# Show plot
fig.show()

# Print last predicted value
print(f"Latest Predicted Temperature: {new_predictions[-1]:.2f}°C")




# Save model architecture to JSON
model_json = model.to_json()
with open("pretrained_lstm_model.json", "w") as json_file:
    json_file.write(model_json)

# Save weights
model.save_weights("pretrained_lstm.weights.h5")
print("Model architecture and weights saved.")


