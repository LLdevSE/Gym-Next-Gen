from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import warnings
import random

warnings.filterwarnings("ignore", category=UserWarning)

app = Flask(__name__)
CORS(app)

print("Loading AI Models and Databases...")

workout_model   = joblib.load('workout_model.pkl')
gender_encoder  = joblib.load('gender_encoder.pkl')
workout_encoder = joblib.load('workout_encoder.pkl')
df_food         = pd.read_csv('gym_nutrition_database.csv')

print(f"✅ All systems online. {len(df_food)} foods loaded.")


# Strict pool: only foods of these types are used for each workout
WORKOUT_DIET_POOLS = {
    "Strength": ["High Protein", "Keto/High Protein", "Balanced/High Protein",
                 "High Calorie", "High Protein/Low Cal", "High Protein/Balanced"],
    "HIIT":     ["Low Calorie", "Vegan/Low Calorie", "Balanced", "Low Carb",
                 "Vegan/Balanced", "High Protein/Low Cal", "Low Carb/High Protein"],
    "Cardio":   ["Low Calorie", "Vegan/Low Calorie", "Balanced", "Low Carb",
                 "Vegan/Balanced", "Low Carb/High Protein"],
    "Yoga":     ["Vegan/Balanced", "Balanced", "Vegan/Low Calorie",
                 "Low Calorie", "Vegan/High Protein"],
}


@app.route('/predict', methods=['POST'])
def predict_blueprint():
    try:
        data        = request.json
        age         = float(data['age'])
        weight      = float(data['weight'])
        height_m    = float(data['height_cm']) / 100
        fat_pct     = float(data['fat_percentage'])
        gender_text = data.get('gender', 'Male')

        # ── BMI ────────────────────────────────────────────────
        bmi = weight / (height_m ** 2)

        # ── Encode gender ───────────────────────────────────────
        try:
            gender_enc = gender_encoder.transform([gender_text])[0]
        except ValueError:
            gender_enc = 0

        # ── Workout prediction ──────────────────────────────────
        feats = np.array([[age, gender_enc, bmi, fat_pct]])
        predicted_workout = workout_encoder.inverse_transform(
            [workout_model.predict(feats)[0]]
        )[0]

        # ── Coach mapping ───────────────────────────────────────
        coach_mapping = {
            "Strength": ["Strength & Conditioning Coach", "Bodybuilding Specialist"],
            "Cardio":   ["Endurance Specialist", "Weight Loss Coach"],
            "Yoga":     ["Yoga & Mobility Instructor", "Corrective Exercise Specialist"],
            "HIIT":     ["HIIT & Cross-Training Coach", "Weight Loss Coach"],
        }
        coaches = coach_mapping.get(predicted_workout, ["General Fitness PT"])

        # ── TDEE — Mifflin-St Jeor ──────────────────────────────
        s = 5 if gender_text.lower() == 'male' else -161
        bmr  = (10 * weight) + (6.25 * (height_m * 100)) - (5 * age) + s

        if predicted_workout == "Strength":
            tdee = bmr * 1.55 + 300
        elif predicted_workout in ("HIIT", "Cardio"):
            tdee = bmr * 1.55 - 300
        else:
            tdee = bmr * 1.375

        # ── Filter food pool ────────────────────────────────────
        allowed_types = WORKOUT_DIET_POOLS.get(predicted_workout, [])
        df_pool = df_food[df_food['Diet_Type'].isin(allowed_types)].copy()
        if len(df_pool) < 5:
            df_pool = df_food.copy()   # fallback to full DB

        # ── Score each food by calorie proximity to per-meal target ──
        per_meal_cal = tdee / 3
        df_pool = df_pool.reset_index(drop=True)
        df_pool['_dist'] = abs(df_pool['Calories'] - per_meal_cal)
        df_pool_sorted = df_pool.sort_values('_dist')

        # Take top-12 candidates, then randomly sample 3 of them
        top_candidates = df_pool_sorted.head(12)
        n_pick = min(3, len(top_candidates))
        selected = top_candidates.sample(n=n_pick, random_state=None)  # None = truly random

        meals = []
        for _, row in selected.iterrows():
            meals.append({
                "name":      str(row['Food_Name']),
                "calories":  int(row['Calories']),
                "protein":   int(row['Protein_g']),
                "diet_type": str(row['Diet_Type']),
            })

        return jsonify({
            "status": "success",
            "diagnostics": {
                "calculated_bmi":            round(bmi, 1),
                "calculated_tdee_calories":  round(tdee),
            },
            "blueprint": {
                "workout_type":        predicted_workout,
                "recommended_coaches": coaches,
                "meal_plan":           meals,
            }
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)