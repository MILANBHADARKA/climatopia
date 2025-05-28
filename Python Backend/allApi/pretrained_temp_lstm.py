from tensorflow.keras.models import model_from_json
from sklearn.preprocessing import MinMaxScaler
import numpy as np
import pandas as pd
import os
from dotenv import load_dotenv
load_dotenv()
import plotly.graph_objects as go
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
print(f"CSV URL: {csv_url}")
def predict_temp_lstm():

    csvfile_url, _ = cloudinary_url(csv_url, resource_type="raw")

    # Load dataset
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
    print("✅ Model compiled successfully.")

    
    print(f"📊 Loading data from: {csvfile_url}")
    # Load new data
    data_path = csvfile_url

    new_df = pd.read_csv(data_path)
    print("📊 Data loaded successfully.")
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


   

    # Plot with Plotly
    fig = go.Figure()

    fig.add_trace(go.Scatter(
    x=new_df.index[window_size:], 
    y=new_predictions, 
    mode='lines',
    name='Predicted Temperature',
    line=dict(color='firebrick')
    ))

    fig.add_trace(go.Scatter(
    x=new_df.index[window_size:], 
    y=new_df['meantemp'].values[window_size:], 
    mode='lines',
    name='Actual Temperature',
    line=dict(color='royalblue', dash='dot')
    ))

    fig.update_layout(
    title='Temperature Prediction for Last 60+ Days',
    xaxis_title='Date',
    yaxis_title='Temperature (°C)',
    legend_title='Legend',
    template='plotly_white',
    hovermode='x unified'
    )

    

    return {
        "predicted_temperature": new_predictions[-1],
        "plotly": fig.to_json(),
    }
