require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
let connectPromise = null;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public', { index: false }));

// Avoid caching HTML so Vercel/browser don't keep an old redirect page around.
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  next();
});

// MongoDB Connection
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectPromise) {
    return connectPromise;
  }

  connectPromise = mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/reviewise')
    .then((conn) => {
      console.log('MongoDB Connected:', conn.connection.host);
      return conn.connection;
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error.message);
      throw error;
    })
    .finally(() => {
      connectPromise = null;
    });

  return connectPromise;
};

// Ensure DB is available before hitting API routes.
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

// Routes
app.use('/api/auth', require('./api/routes/auth'));
app.use('/api/dashboard', require('./api/routes/dashboard'));
app.use('/api/quiz', require('./api/routes/quiz'));
app.use('/api/ai-settings', require('./api/routes/ai-settings'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'start.html'));
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'start.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

if (process.env.VERCEL) {
  module.exports = app;
} else {
  const PORT = process.env.PORT || 5000;
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch(() => {
      process.exit(1);
    });
}
