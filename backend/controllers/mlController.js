const axios = require('axios');

// @desc    Predict workout and nutrition via Python ML microservice
// @route   POST /api/ml/predict
// @access  Private/Customer
const predictBlueprint = async (req, res) => {
  try {
    const { age, gender, weight, height, fatPercentage } = req.body;

    // Call the Python FastAPI / Flask service running on port 8000 (app.py shows 8000)
    const response = await axios.post('http://localhost:8000/predict', {
      features: [age, weight, height, fatPercentage], // Adjust based on your Python model requirements
    });

    res.json({
      modelPrediction: response.data,
      // You can add more complex logic here later, mapping prediction to DB coaches, etc.
    });

  } catch (error) {
    console.error('Error proxying to ML service:', error.message);
    // Return a mocked response if the python server is down during active dev
    res.status(503).json({
       message: 'ML Service Unavailable. Mocking result.',
       mockedResponse: {
          workout: "Strength & Hypertrophy",
          calories: 2500,
          meals: ["Oatmeal & Eggs", "Chicken & Rice", "Steak & Potatoes"]
       }
    });
  }
};

module.exports = { predictBlueprint };
