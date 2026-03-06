"""
Retrain only the KNN Nutrition model with the expanded food database.
Run from the ml-service/ directory:  python retrain_nutrition.py
"""
import joblib
import pandas as pd
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler

print("Loading expanded nutrition database...")
df = pd.read_csv('gym_nutrition_database.csv')
print(f"  Rows loaded: {len(df)}")

# Features: Calories, Protein, Carbs, Fat
features = df[['Calories', 'Protein_g', 'Carbs_g', 'Fat_g']].values

# Retrain scaler
scaler = StandardScaler()
features_scaled = scaler.fit_transform(features)

# Retrain KNN with slightly more neighbors so we can pick varied results
knn = NearestNeighbors(n_neighbors=5, algorithm='ball_tree')
knn.fit(features_scaled)

# Save models
joblib.dump(knn, 'nutrition_model.pkl')
joblib.dump(scaler, 'nutrition_scaler.pkl')

print("✅ nutrition_model.pkl and nutrition_scaler.pkl retrained and saved!")
print(f"   Dataset size: {len(df)} foods | KNN k=5")

# Quick sanity check
import numpy as np
test_macro = pd.DataFrame([[800, 50, 90, 20]], columns=['Calories', 'Protein_g', 'Carbs_g', 'Fat_g'])
scaled = scaler.transform(test_macro)
dists, idxs = knn.kneighbors(scaled)
print("\nSanity check (800cal, 50p, 90c, 20f):")
for i in idxs[0]:
    print(f"  - {df.iloc[i]['Food_Name']} | {df.iloc[i]['Calories']} kcal | {df.iloc[i]['Diet_Type']}")
