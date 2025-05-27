import pandas as pd
import plotly.graph_objects as go
import os
from datetime import datetime, timedelta

def plot_electricity_forecasts(base_path, timestamp=None):
    # Use current time if none provided
    if timestamp is None:
        timestamp = datetime.now()
    else:
        timestamp = pd.to_datetime(timestamp)

    print(f"Using reference timestamp: {timestamp}")

    # Load datasets
    hourly_path = os.path.join(base_path, 'Datasets', '2025 testset.csv')
    daily_path = os.path.join(base_path, 'Datasets', 'dummy_electricity_daily_data.csv')
    monthly_path = os.path.join(base_path, 'Datasets', 'dummy_electricity_monthly_data.csv')

    hourly_df = pd.read_csv(hourly_path)
    daily_df = pd.read_csv(daily_path)
    monthly_df = pd.read_csv(monthly_path)

    # Auto-detect datetime columns
    def detect_and_parse_datetime(df, possible_columns):
        for col in df.columns:
            lower_col = col.lower()
            if any(possible in lower_col for possible in possible_columns):
                df[col] = pd.to_datetime(df[col])
                print(f"Parsed datetime column: '{col}'")
                return col
        raise KeyError(f"None of the expected datetime columns {possible_columns} found in dataframe.")

    # Detect time columns
    hourly_time_col = detect_and_parse_datetime(hourly_df, ['datetime', 'timestamp'])
    daily_time_col = detect_and_parse_datetime(daily_df, ['date', 'day', 'time'])
    monthly_time_col = detect_and_parse_datetime(monthly_df, ['month', 'date', 'time'])

    # -------- Filter data --------
    hourly_future = hourly_df[
        (hourly_df[hourly_time_col] >= timestamp) &
        (hourly_df[hourly_time_col] < timestamp + timedelta(hours=24))
    ]

    daily_future = daily_df[
        (daily_df[daily_time_col] >= timestamp) &
        (daily_df[daily_time_col] < timestamp + timedelta(days=30))
    ]

    monthly_future = monthly_df[
        (monthly_df[monthly_time_col] >= timestamp) &
        (monthly_df[monthly_time_col] < timestamp + pd.DateOffset(months=12))
    ]

    # -------- Plot 1: Hourly (next 24 hours) --------
    fig_hourly = go.Figure()
    fig_hourly.add_trace(go.Scatter(
        x=hourly_future[hourly_time_col],
        y=hourly_future['electricity_demand'],
        mode='lines+markers',
        name='Hourly Demand'
    ))
    fig_hourly.update_layout(
        title='Next 24 Hours Electricity Demand Forecast',
        xaxis_title='Timestamp',
        yaxis_title='Electricity Demand',
        hovermode='x unified'
    )
    fig_hourly.show()

    # -------- Plot 2: Daily (next 30 days) --------
    fig_daily = go.Figure()
    fig_daily.add_trace(go.Scatter(
        x=daily_future[daily_time_col],
        y=daily_future['electricity_demand'],
        mode='lines+markers',
        name='Daily Demand'
    ))
    fig_daily.update_layout(
        title='Next 30 Days Electricity Demand Forecast',
        xaxis_title='Date',
        yaxis_title='Electricity Demand',
        hovermode='x unified'
    )
    fig_daily.show()

    # -------- Plot 3: Monthly (next 12 months) --------
    fig_monthly = go.Figure()
    fig_monthly.add_trace(go.Scatter(
        x=monthly_future[monthly_time_col],
        y=monthly_future['electricity_demand'],
        mode='lines+markers',
        name='Monthly Demand'
    ))
    fig_monthly.update_layout(
        title='Next 12 Months Electricity Demand Forecast',
        xaxis_title='Month',
        yaxis_title='Electricity Demand',
        hovermode='x unified'
    )
    # fig_monthly.show()


# Example usage:
if __name__ == "__main__":
    base_path = os.path.dirname(__file__)
    # Call without timestamp → uses current time
    plot_electricity_forecasts(base_path)

    # Call with a custom timestamp → e.g., '2025-06-01 00:00'
    # plot_electricity_forecasts(base_path, '2025-06-01 00:00')
