import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Database connection
const connectDB = async () => {
  try {
    let dbUri = process.env.MONGO_URI;

    if (!dbUri) {
      console.log('No MONGO_URI found, setting up in-memory MongoDB...');
      const mongoServer = await MongoMemoryServer.create();
      dbUri = mongoServer.getUri();
    }

    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected to: ${dbUri}`);
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send('Team Task Manager API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
