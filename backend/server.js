const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { MongoClient, Db } = require('mongodb');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/newsly_db';

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001'
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.JWT_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongoUrl: MONGODB_URI
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    // Extend session lifetime (default 30 minutes) and make it configurable
    maxAge: (parseInt(process.env.SESSION_MAX_AGE_MINUTES, 10) || 30) * 60 * 1000
  },
  // Refresh cookie on each response to extend active sessions
  rolling: true
}));

// MongoDB connection
let db;

// Make db available to routes
app.use((req, res, next) => {
  if (!db) {
    return res.status(503).json({ error: 'Database not connected yet. Please try again.' });
  }
  req.db = db;
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth')(express.Router()));
app.use('/api/epaper', require('./routes/epaper')(express.Router()));
app.use('/api/news', require('./routes/news')(express.Router()));

// Connect to MongoDB and start server
MongoClient.connect(MONGODB_URI)
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db('newsly_db');
  })
  .catch(error => {
    console.error('MongoDB connection error:', error);
    console.error('Please ensure MongoDB is running on mongodb://localhost:27017/');
    process.exit(1);
  });

// Health check (no db required)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Server is running',
    database: db ? 'connected' : 'not connected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
