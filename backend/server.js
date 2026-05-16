const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true } 
});

const User = mongoose.model('User', userSchema);

// Seed DB
const seedDB = async () => {
  const count = await User.countDocuments();
  if (count === 0) {
    await User.create({ email: 'test@example.com', password: 'password123' });
    console.log('Seed user created.');
  }
};

const startDBAndServer = async () => {
  try {
    // In-memory MongoDB for local testing if needed
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    await mongoose.connect(mongoUri);
    console.log('Connected to In-Memory MongoDB');
    
    await seedDB();

    // Login Endpoint
    app.post('/api/login', async (req, res) => {
      const { email, password } = req.body;
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (user.password !== password) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.json({ message: 'Login successful', user: { email: user.email } });
      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Database connection error:', err);
  }
};

startDBAndServer();
