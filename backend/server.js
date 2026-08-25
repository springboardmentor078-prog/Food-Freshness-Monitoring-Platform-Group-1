const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const inventoryRoutes = require('./routes/inventory');
const analysisRoutes = require('./routes/analysis');

app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/analysis', analysisRoutes);

app.get('/', (req, res) => {
  res.send('Food Freshness API is running');
});

const { MongoMemoryServer } = require('mongodb-memory-server');

// Database
const connectDB = async () => {
    let uri = process.env.MONGODB_URI;
    if (!uri || uri.length < 20 || !uri.startsWith('mongodb')) {
        console.log("No valid MONGODB_URI provided. Starting in-memory MongoDB...");
        const mongoServer = await MongoMemoryServer.create();
        uri = mongoServer.getUri();
        console.log("In-memory MongoDB started");
    }
    
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
    
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
connectDB();
