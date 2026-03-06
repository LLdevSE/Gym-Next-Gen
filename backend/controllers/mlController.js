const axios = require('axios');

// @desc    Predict workout and nutrition via Python ML microservice
// @route   POST /api/ml/predict
// @access  Private/Customer
const predictBlueprint = async (req, res) => {
  try {
    const { age, gender, weight, height, fatPercentage } = req.body;

    // Call the Python Flask service — app.py runs on port 5000
    const response = await axios.post('http://localhost:5000/predict', {
      age: Number(age),
      gender: gender || 'Male',
      weight: Number(weight),
      height_cm: Number(height),        // Python expects 'height_cm'
      fat_percentage: Number(fatPercentage), // Python expects 'fat_percentage'
    });

    const pythonData = response.data;

    // Map Python's response shape to the format the frontend expects:
    // Python returns: { blueprint: { workout_type, meal_plan: [{name, calories, protein, diet_type}], recommended_coaches } }
    // Frontend expects: { workout, calories, meals: [string], coaches: [string] }

    const blueprint = pythonData.blueprint || {};
    const mealPlan = blueprint.meal_plan || [];
    const diagnostics = pythonData.diagnostics || {};

    const mappedResponse = {
      workout: blueprint.workout_type || 'General Fitness',
      calories: diagnostics.calculated_tdee_calories || 2000,
      meals: mealPlan.map(m => `${m.name} — ${m.calories} kcal (${m.protein}g protein)`),
      coaches: blueprint.recommended_coaches || [],
      bmi: diagnostics.calculated_bmi || null,
    };

    res.json({ modelPrediction: mappedResponse });

  } catch (error) {
    console.error('Error proxying to ML service:', error.message);

    // Return a mocked response if the Python server is down
    res.json({
      mockedResponse: {
        workout: 'Strength & Hypertrophy',
        calories: 2500,
        meals: [
          'Oatmeal & 3 Eggs — 480 kcal (30g protein)',
          'Chicken Breast & Rice — 600 kcal (45g protein)',
          'Steak & Sweet Potato — 550 kcal (40g protein)',
        ],
        coaches: ['Strength & Conditioning Coach'],
        bmi: null,
      },
    });
  }
};

module.exports = { predictBlueprint };
