import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
from xgboost import XGBClassifier
from sklearn.preprocessing import LabelEncoder
from scipy.stats import uniform, randint
import plotly.express as px
import os

# File paths
base_path = os.path.dirname(__file__)
file_path = os.path.join(base_path, 'Datasets', 'climate_change_impact_on_agriculture_2024.csv')

# Load dataset
df = pd.read_csv(file_path)

# Drop missing values
df.dropna(inplace=True)

# Encode the target column (Adaptation_Strategies)
label_encoder = LabelEncoder()
df['Adaptation_Strategies_Encoded'] = label_encoder.fit_transform(df['Adaptation_Strategies'])

# Drop original 'Adaptation_Strategies' from X
X = df.drop(columns=["Adaptation_Strategies", "Economic_Impact_Million_USD", "Region", "Crop_Type", "Year", 
                     "Extreme_Weather_Events", "Irrigation_Access_%", "Country", "Adaptation_Strategies_Encoded"])
y = df["Adaptation_Strategies_Encoded"]


# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Define hyperparameter search space
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

# Initialize classifier
xgb_clf = XGBClassifier(objective="multi:softmax", num_class=len(np.unique(y)), random_state=42)

# RandomizedSearchCV
random_search = RandomizedSearchCV(
    xgb_clf,
    param_distributions=param_dist,
    n_iter=50,
    scoring="accuracy",
    cv=3,
    verbose=1,
    random_state=42,
    n_jobs=-1
)

random_search.fit(X_train, y_train)

# Best model
best_model = random_search.best_estimator_

# Predict
y_pred = best_model.predict(X_test)

# Evaluation
print("\n✅ Classification Report:")
print(classification_report(y_test, y_pred, target_names=label_encoder.classes_))

accuracy = accuracy_score(y_test, y_pred)
print(f"✅ Overall Accuracy: {accuracy:.4f}")

# Confusion Matrix
conf_matrix = confusion_matrix(y_test, y_pred)

# Visualize confusion matrix
fig = px.imshow(conf_matrix,
                labels=dict(x="Predicted", y="Actual", color="Count"),
                x=label_encoder.classes_,
                y=label_encoder.classes_,
                text_auto=True,
                title="🔍 Confusion Matrix: Adaptation Strategies Classification")

fig.update_layout(width=700, height=700)
# fig.show()

# Feature importance plot
importances = best_model.feature_importances_
feature_names = X.columns
feature_importance_fig = px.bar(
    x=importances,
    y=feature_names,
    orientation='h',
    labels={'x': 'Importance', 'y': 'Features'},
    title='📊 Feature Importance (XGBoost Classifier)'
)

feature_importance_fig.update_layout(template='plotly_white', yaxis={'categoryorder': 'total ascending'})
# feature_importance_fig.show()

# Save the trained classification model
best_model.save_model("pretrained_adaptation_classifier.json")
print("✅ Classification model saved as JSON.")
