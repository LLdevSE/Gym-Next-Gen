from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import warnings

# Suppress sklearn warnings for cleaner terminal output
warnings.filterwarnings("ignore", category=UserWarning)

app = Flask(__name__)
CORS(app) # Allows your Node.js backend to make requests to this API

print("Loading AI Models and Databases...")

# 1. Load the Workout Models
workout_model = joblib.load('workout_model.pkl')
gender_encoder = joblib.load('gender_encoder.pkl')
workout_encoder = joblib.load('workout_encoder.pkl')

# 2. Load the Nutrition Models & Database
nutrition_model = joblib.load('nutrition_model.pkl')
nutrition_scaler = joblib.load('nutrition_scaler.pkl')
df_food = pd.read_csv('gym_nutrition_database.csv')

print("✅ All systems online. ML Microservice running.")

@app.route('/predict', methods=['POST'])
def predict_blueprint():
    try:
        # 1. Get user data from the incoming JSON request
        data = request.json
        age = float(data['age'])
        weight = float(data['weight'])
        height_m = float(data['height_cm']) / 100  # Convert cm to meters
        fat_percentage = float(data['fat_percentage'])
        gender_text = data['gender'] # 'Male' or 'Female'

        # 2. Preprocess the input
        bmi = weight / (height_m ** 2)
        
        # Handle unseen gender labels gracefully
        try:
            gender_encoded = gender_encoder.transform([gender_text])[0]
        except ValueError:
            gender_encoded = 0 # Default fallback
            
        # Create the feature array expected by the Random Forest Model
        # Order: ['Age', 'Gender', 'BMI', 'Fat_Percentage']
        user_features = np.array([[age, gender_encoded, bmi, fat_percentage]])

        # 3. Predict Workout Type
        workout_pred_idx = workout_model.predict(user_features)[0]
        predicted_workout = workout_encoder.inverse_transform([workout_pred_idx])[0]

        # 4. Map Recommended Coaches (Rule-Based Logic)
        coach_mapping = {
            "Strength": ["Strength & Conditioning Coach", "Bodybuilding Specialist"],
            "Cardio": ["Endurance Specialist", "Weight Loss Coach"],
            "Yoga": ["Yoga & Mobility Instructor", "Corrective Exercise Specialist"],
            "HIIT": ["HIIT & Cross-Training Coach", "Weight Loss Coach"]
        }
        recommended_coaches = coach_mapping.get(predicted_workout, ["General Fitness PT"])

        # 5. The "Bridge": Calculate Caloric and Macro Targets based on Workout
        # Simple BMR calculation (Mifflin-St Jeor Equation)
        if gender_text.lower() == 'male':
            bmr = (10 * weight) + (6.25 * (height_m * 100)) - (5 * age) + 5
        else:
            bmr = (10 * weight) + (6.25 * (height_m * 100)) - (5 * age) - 161

        # Adjust TDEE (Total Daily Energy Expenditure) and Macros based on predicted workout
        if predicted_workout == "Strength":
            tdee = bmr * 1.55 + 300 # Surplus for muscle gain
            protein, carbs, fat = (weight * 2.2), (tdee * 0.45 / 4), (tdee * 0.25 / 9)
        elif predicted_workout == "HIIT" or predicted_workout == "Cardio":
            tdee = bmr * 1.55 - 300 # Deficit for fat loss
            protein, carbs, fat = (weight * 1.8), (tdee * 0.35 / 4), (tdee * 0.30 / 9)
        else: # Yoga / Maintenance
            tdee = bmr * 1.375
            protein, carbs, fat = (weight * 1.6), (tdee * 0.40 / 4), (tdee * 0.30 / 9)

        # 6. Predict Nutrition (KNN Model)
        # We divide targets by 3 assuming 3 main meals a day
        target_macros = pd.DataFrame(
            [[(tdee/3), (protein/3), (carbs/3), (fat/3)]], 
            columns=['Calories', 'Protein_g', 'Carbs_g', 'Fat_g']
        )
        target_scaled = nutrition_scaler.transform(target_macros)
        
        # Find 3 closest meal matches
        distances, indices = nutrition_model.kneighbors(target_scaled)
        
        recommended_meals = []
        for i in range(len(indices[0])):
            meal_idx = indices[0][i]
            meal = {
                "name": str(df_food.iloc[meal_idx]['Food_Name']),
                "calories": int(df_food.iloc[meal_idx]['Calories']),
                "protein": int(df_food.iloc[meal_idx]['Protein_g']),
                "diet_type": str(df_food.iloc[meal_idx]['Diet_Type'])
            }
            recommended_meals.append(meal)

        # 7. Construct and return the final API response
        return jsonify({
            "status": "success",
            "diagnostics": {
                "calculated_bmi": round(bmi, 1),
                "calculated_tdee_calories": round(tdee)
            },
            "blueprint": {
                "workout_type": predicted_workout,
                "recommended_coaches": recommended_coaches,
                "meal_plan": recommended_meals
            }
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

if __name__ == '__main__':
    # Run the Flask app on port 5000
    app.run(host='0.0.0.0', port=5000, debug=True)