import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

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
const User = mongoose.models.User || mongoose.model('User', userSchema);

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  
  if (process.env.MONGODB_URI) {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = db.connections[0].readyState;
    console.log('Connected to MongoDB Atlas');
  } else if (!process.env.VERCEL) {
    // Only use memory server locally
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    isConnected = true;
    console.log('Connected to In-Memory MongoDB');
    
    // Seed DB
    const count = await User.countDocuments();
    if (count === 0) {
      await User.create({ email: 'test@example.com', password: 'password123' });
      console.log('Seed user created.');
    }
  }
};

// Login Endpoint
app.post('/api/login', async (req, res) => {
  await connectDB();
  const { email, password } = req.body;

  // If deployed to Vercel without a real MONGODB_URI, use dummy logic
  if (process.env.VERCEL && !process.env.MONGODB_URI) {
    if (email === 'test@example.com' && password === 'password123') {
      return res.json({ message: 'Login successful', user: { email } });
    }
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ message: 'Login successful', user: { email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Only start the server if we're not on Vercel
if (!process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}

// Export the Express app for Vercel
export default app;
