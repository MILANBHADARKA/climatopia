import pandas as pd
import os
import numpy as np
import xgboost as xgb
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import mean_squared_error, r2_score
import plotly.graph_objects as go

# Load datasets
base_path = os.path.dirname(__file__)
train_file_path = os.path.join(base_path, 'Datasets', '2023 dataset.csv')
train_df = pd.read_csv(train_file_path)

test_file_path = os.path.join(base_path, 'Datasets', '2025 testset.csv')
test_df = pd.read_csv(test_file_path)

# Convert datetime if exists
for df in [train_df, test_df]:
    if 'datetime' in df.columns:
        df['datetime'] = pd.to_datetime(df['datetime'])
        df['hour'] = df['datetime'].dt.hour
        df['day'] = df['datetime'].dt.day
        df['month'] = df['datetime'].dt.month
        df['weekday'] = df['datetime'].dt.weekday

# Prepare features and targets
X_train = train_df.select_dtypes(include=['float64', 'int64']).drop(columns=['electricity_demand'])
y_train = train_df['electricity_demand']

X_test = test_df.select_dtypes(include=['float64', 'int64']).drop(columns=['electricity_demand'])
y_test = test_df['electricity_demand']

# Define XGBoost regressor
xgb_model = xgb.XGBRegressor(objective='reg:squarederror', random_state=42)

# Define parameter grid for tuning
param_grid = {
    'n_estimators': [100, 200],
    'learning_rate': [0.01, 0.1, 0.2],
    'max_depth': [3, 5, 7],
    'subsample': [0.8, 1.0]
}

# Grid Search with 3-fold cross-validation
grid_search = GridSearchCV(
    estimator=xgb_model,
    param_grid=param_grid,
    cv=3,
    scoring='neg_root_mean_squared_error',
    verbose=1,
    n_jobs=-1
)

# Fit grid search
grid_search.fit(X_train, y_train)

print(f"✅ Best Parameters: {grid_search.best_params_}")
print(f"✅ Best RMSE (CV): {-grid_search.best_score_:.2f}")

# Use best model to predict
best_model = grid_search.best_estimator_
y_pred = best_model.predict(X_test)

# Evaluate
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)

print(f"Test RMSE: {rmse:.2f}")
print(f"Test R² Score: {r2:.4f}")

# Plot actual vs predicted
fig = go.Figure()
fig.add_trace(go.Scatter(y=y_test, mode='lines+markers', name='Actual Demand'))
fig.add_trace(go.Scatter(y=y_pred, mode='lines+markers', name='Predicted Demand'))

fig.update_layout(
    title='Electricity Demand: Actual vs Predicted (Best XGBoost Model)',
    xaxis_title='Sample Index',
    yaxis_title='Demand',
    legend=dict(x=0, y=1),
    hovermode='x unified'
)

# fig.show()

best_model.save_model("xgb_electricity_model.json")
print("✅ XGBoost model saved as JSON.")


