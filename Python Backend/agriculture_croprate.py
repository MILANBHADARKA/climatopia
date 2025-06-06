# -*- coding: utf-8 -*-
"""Agriculture_CropRate.ipynb

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/drive/1ijO_oTfx98i65hNCYA_CpAAXluNo89cj
"""





import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from xgboost import XGBRegressor
import matplotlib.pyplot as plt
from scipy.stats import uniform, randint
import plotly.graph_objects as go
import plotly.express as px
import os


base_path = os.path.dirname(__file__)  # folder of this script
file_path = os.path.join(base_path, 'Datasets', 'climate_change_impact_on_agriculture_2024.csv')

# Load dataset
df = pd.read_csv(file_path)

# Drop rows with missing values
df.dropna(inplace=True)



# Define features and target
X = df.drop(columns=["Crop_Yield_MT_per_HA", "Region","Crop_Type", "Year", "Extreme_Weather_Events",
                     "Irrigation_Access_%", 'Adaptation_Strategies', 'Country'])
y = df["Crop_Yield_MT_per_HA"]



# Split into train and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Define parameter grid for Randomized Search
param_dist = {
    "n_estimators": randint(100, 300),
    "max_depth": randint(3, 10),
    "learning_rate": uniform(0.01, 0.3),
    "subsample": uniform(0.6, 0.4),
    "colsample_bytree": uniform(0.6, 0.4),
    "gamma": uniform(0, 0.5),
    "reg_alpha": uniform(0, 1),
    "reg_lambda": uniform(0, 1)
}

# Initialize model
xgb_model = XGBRegressor(objective="reg:squarederror", random_state=42)

# Randomized Search CV
random_search = RandomizedSearchCV(
    xgb_model,
    param_distributions=param_dist,
    n_iter=50,
    scoring="r2",
    cv=3,
    verbose=1,
    random_state=42,
    n_jobs=-1
)

random_search.fit(X_train, y_train)

# Best estimator
best_model = random_search.best_estimator_

# Predict
y_pred = best_model.predict(X_test)

# Evaluate
mse = mean_squared_error(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"✅ Evaluation Metrics after Random Search CV:")
print(f"• Mean Squared Error (MSE): {mse:.4f}")
print(f"• Mean Absolute Error (MAE): {mae:.4f}")
print(f"• R² Score: {r2:.4f}")

# Compute feature importances
importances = best_model.feature_importances_
indices = np.argsort(importances)[::-1]
features = X.columns[indices]



# === Plotly: Actual vs Predicted Crop Yield ===
scatter_fig = go.Figure()

scatter_fig.add_trace(go.Scatter(
    x=y_test,
    y=y_pred,
    mode='markers',
    marker=dict(color='teal', opacity=0.7),
    name='Predictions',
    text=[f'Actual: {a:.2f}<br>Predicted: {p:.2f}' for a, p in zip(y_test, y_pred)],
    hoverinfo='text'
))

# Add reference line
min_val = min(y_test.min(), y_pred.min())
max_val = max(y_test.max(), y_pred.max())
scatter_fig.add_trace(go.Scatter(
    x=[min_val, max_val],
    y=[min_val, max_val],
    mode='lines',
    line=dict(color='red', dash='dash'),
    name='Ideal Prediction'
))

scatter_fig.update_layout(
    title='📈 Actual vs Predicted Crop Yield (XGBoost)',
    xaxis_title='Actual Crop Yield',
    yaxis_title='Predicted Crop Yield',
    template='plotly_white',
    legend=dict(x=0.01, y=0.99),
    width=900,
    height=600
)
# scatter_fig.show()

# === Plotly: Feature Importance ===
feature_importance_fig = px.bar(
    x=importances[indices],
    y=features,
    orientation='h',
    labels={'x': 'Importance', 'y': 'Features'},
    title='📊 Feature Importance (XGBoost)',
    text=importances[indices].round(3)
)

feature_importance_fig.update_traces(marker_color='royalblue', textposition='outside')
feature_importance_fig.update_layout(
    template='plotly_white',
    yaxis={'categoryorder': 'total ascending'},
    width=900,
    height=600
)
# feature_importance_fig.show()

best_model.save_model("pretrained_croprate_xgb.json")
print("✅ XGBoost model saved as JSON.")




X.columns