const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route Imports
const userRoutes = require('./routes/userRoutes');
const coachRoutes = require('./routes/coachRoutes');
const productRoutes = require('./routes/productRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const mlRoutes = require('./routes/mlRoutes');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount Routes
app.use('/api/users', userRoutes);
app.use('/api/coaches', coachRoutes);
app.use('/api/products', productRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/ml', mlRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('GYM NEXT GEN API is running...');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
