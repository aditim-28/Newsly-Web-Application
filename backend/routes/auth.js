const bcrypt = require('bcryptjs');

module.exports = (router) => {
  // Signup
  router.post('/signup', async (req, res) => {
    try {
      const { firstName, email, password } = req.body;

      if (!firstName || !email || !password) {
        return res.status(400).json({ error: 'All fields are required!' });
      }

      const db = req.db;
      const usersCollection = db.collection('users');

      // Check if user already exists
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists!' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      await usersCollection.insertOne({
        name: firstName,
        email,
        password: hashedPassword,
        createdAt: new Date()
      });

      res.status(201).json({ message: 'Signup successful! Please login.' });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Server error during signup' });
    }
  });

  // Signin
  router.post('/signin', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Both email and password are required!' });
      }

      const db = req.db;
      const usersCollection = db.collection('users');

      const user = await usersCollection.findOne({ email });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Set session
      req.session.user = user.name;
      req.session.email = user.email;

      res.json({ 
        message: 'Login successful!',
        user: {
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Signin error:', error);
      res.status(500).json({ error: 'Server error during signin' });
    }
  });

  // Check auth status
  router.get('/status', (req, res) => {
    if (req.session.user) {
      res.json({
        authenticated: true,
        user: {
          name: req.session.user,
          email: req.session.email
        }
      });
    } else {
      res.json({ authenticated: false });
    }
  });

  // Logout
  router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Logout failed' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  });

  return router;
};
