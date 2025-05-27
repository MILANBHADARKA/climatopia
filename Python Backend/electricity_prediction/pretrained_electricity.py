import os
import pandas as pd
from datetime import datetime, timedelta
import plotly.graph_objs as go
import xgboost as xgb


def load_xgboost_model(model_path):
    try:
        model = xgb.XGBRegressor()
        model.load_model(model_path)
        return model
    except Exception as e:
        print(f"Error loading model: {e}")
        return None


def electricity_demand_prediction(start_datetime):
    dataset_path = os.path.join(os.path.dirname(__file__), 'Datasets', '2025 testset.csv')
    model_path = os.path.join(os.path.dirname(__file__), 'xgb_electricity_model.json')

    # Load dataset
    df = pd.read_csv(dataset_path, parse_dates=['timestamp'])

    # Define 24h range
    end_datetime = start_datetime + timedelta(hours=24)

    # Filter and copy to avoid SettingWithCopyWarning
    df_24h = df[(df['timestamp'] >= start_datetime) & (df['timestamp'] < end_datetime)].copy()

    if df_24h.empty:
        print("No data available for the next 24 hours from the given start datetime.")
        return

    # Load model
    model = load_xgboost_model(model_path)
    if model is None:
        print("Model could not be loaded.")
        return

    # Feature engineering matching model's training features
    df_24h['day_of_week'] = df_24h['timestamp'].dt.dayofweek
    df_24h['hour_of_day'] = df_24h['timestamp'].dt.hour
    df_24h['is_weekend'] = (df_24h['day_of_week'] >= 5).astype(int)

    features = ['day_of_week', 'hour_of_day', 'is_weekend', 'temperature', 'is_holiday', 'solar_generation']

    X_test = df_24h[features]

    # Predict
    df_24h['predicted_demand'] = model.predict(X_test)

    # Identify peak and lowest demand points
    peak_point = df_24h.loc[df_24h['predicted_demand'].idxmax()]
    lowest_point = df_24h.loc[df_24h['predicted_demand'].idxmin()]

    # Plotting with Plotly
    fig = go.Figure()

    fig.add_trace(go.Scatter(
        x=df_24h['timestamp'], y=df_24h['predicted_demand'],
        mode='lines+markers', name='Predicted Electricity Demand',
        line=dict(color='blue'), marker=dict(size=4)
    ))

    fig.add_trace(go.Scatter(
        x=[peak_point['timestamp'], lowest_point['timestamp']],
        y=[peak_point['predicted_demand'], lowest_point['predicted_demand']],
        mode="markers",
        marker=dict(color='red', size=10, symbol='circle'),
        name="Highlighted Points"
    ))

    fig.add_annotation(
        x=peak_point['timestamp'], y=peak_point['predicted_demand'],
        text=f"Peak: {peak_point['predicted_demand']:.2f}",
        showarrow=True, arrowhead=2, ax=30, ay=-40, bgcolor="yellow"
    )

    fig.add_annotation(
        x=lowest_point['timestamp'], y=lowest_point['predicted_demand'],
        text=f"Lowest: {lowest_point['predicted_demand']:.2f}",
        showarrow=True, arrowhead=2, ax=-30, ay=40, bgcolor="lightgreen"
    )

    fig.update_layout(
        title=f"⚡ Predicted Electricity Demand from {start_datetime} to {end_datetime}",
        xaxis_title="Time",
        yaxis_title="Electricity Demand (units)",
        template="plotly_white",
        xaxis=dict(tickformat="%H:%M", tickangle=45)
    )

    fig.show()

    

# Example usage:
if __name__ == "__main__":
    now = datetime.now()
    electricity_demand_prediction(now)
