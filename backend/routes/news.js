const axios = require('axios');

// GNews API configuration
const GNEWS_API_KEY = process.env.GNEWS_API_KEY || 'YOUR_GNEWS_API_KEY'; // Get from https://gnews.io
const GNEWS_API_BASE = 'https://gnews.io/api/v4';

const topicMapping = {
  'top stories': null, // handled via headlines
  'business': 'business',
  'sports': 'sports',
  'entertainment': 'entertainment',
  'technology': 'technology',
  'health': 'health',
  'world': 'world',
  'science': 'science'
};

// State mapping for regional news
const stateMapping = {
  'maharashtra': { lang: 'mr', q: 'महाराष्ट्र' },
  'karnataka': { lang: 'kn', q: 'ಕರ್ನಾಟಕ' },
  'tamil nadu': { lang: 'ta', q: 'தமிழ்நாடு' },
  'telangana': { lang: 'te', q: 'తెలంగాణ' },
  'andhra pradesh': { lang: 'te', q: 'ఆంధ్ర ప్రదేశ్' },
  'west bengal': { lang: 'bn', q: 'পশ্চিমবঙ্গ' },
  'bihar': { lang: 'hi', q: 'बिहार' },
  'uttar pradesh': { lang: 'hi', q: 'उत्तर प्रदेश' },
  'madhya pradesh': { lang: 'hi', q: 'मध्य प्रदेश' },
  'rajasthan': { lang: 'hi', q: 'राजस्थान' },
  'punjab': { lang: 'pa', q: 'ਪੰਜਾਬ' },
  'haryana': { lang: 'hi', q: 'हरियाणा' },
  'delhi': { lang: 'hi', q: 'दिल्ली' },
  'kerala': { lang: 'ml', q: 'കേരളം' },
  'goa': { lang: 'mr', q: 'गोवा' },
  'dhaka': { lang: 'bn', q: 'ঢাকা' }
};

module.exports = (router) => {
  // Server-Sent Events: realtime headlines stream
  router.get('/stream', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    let alive = true;
    req.on('close', () => {
      alive = false;
    });

    const sendEvent = (event) => {
      // event: { type?: string, data: any }
      const payload = typeof event.data === 'string' ? event.data : JSON.stringify(event.data);
      if (!alive) return;
      if (event.type) res.write(`event: ${event.type}\n`);
      res.write(`data: ${payload}\n\n`);
    };

    const fetchAndPush = async () => {
      try {
        const response = await axios.get(`${GNEWS_API_BASE}/top-headlines`, {
          params: {
            apikey: GNEWS_API_KEY,
            lang: 'en',
            country: 'in',
            max: 12
          }
        });
        const articles = response.data?.articles || [];
        sendEvent({ type: 'headlines', data: { ts: Date.now(), articles } });
      } catch (error) {
        sendEvent({ type: 'error', data: { message: 'Live headlines unavailable', detail: error.message } });
      }
    };

    // Push immediately, then every 60s
    fetchAndPush();
    const interval = setInterval(fetchAndPush, 60000);
    req.on('close', () => clearInterval(interval));
  });
  // Get top headlines for landing page
  router.get('/headlines', async (req, res) => {
    try {
      const response = await axios.get(`${GNEWS_API_BASE}/top-headlines`, {
        params: {
          apikey: GNEWS_API_KEY,
          lang: 'en',
          country: 'in',
          max: 12
        }
      });

      res.json({
        articles: response.data.articles || [],
        totalArticles: response.data.totalArticles || 0
      });
    } catch (error) {
      console.error('GNews API Error:', error.message);
      const now = new Date().toISOString();
      // Return richer mock data if API fails so the UI shows cards
      res.json({
        articles: [
          {
            title: 'India at a glance: key stories today',
            description: 'Top developments across business, tech, politics, and sports to keep you informed quickly.',
            url: 'https://newsly.example.com/today',
            image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=900&q=80',
            publishedAt: now,
            source: { name: 'Newsly Brief' }
          },
          {
            title: 'Markets and startups: what moved',
            description: 'A concise wrap of market moves, funding rounds, and startup launches across India.',
            url: 'https://newsly.example.com/markets',
            image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80',
            publishedAt: now,
            source: { name: 'Newsly Markets' }
          },
          {
            title: 'Tech and science roundup',
            description: 'Product launches, research highlights, and policy shifts shaping the tech landscape.',
            url: 'https://newsly.example.com/tech',
            image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80',
            publishedAt: now,
            source: { name: 'Newsly Tech' }
          },
          {
            title: 'Sports highlights: matches and medals',
            description: 'Quick recap of major games, scores, and standout performances.',
            url: 'https://newsly.example.com/sports',
            image: 'https://images.unsplash.com/photo-1505842679547-4976cbaed83f?auto=format&fit=crop&w=900&q=80',
            publishedAt: now,
            source: { name: 'Newsly Sports' }
          },
          {
            title: 'Civics and policy watch',
            description: 'New bills, civic updates, and policy moves that affect daily life.',
            url: 'https://newsly.example.com/civics',
            image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
            publishedAt: now,
            source: { name: 'Newsly Policy' }
          },
          {
            title: 'Culture and lifestyle picks',
            description: 'Films, music, food, and travel ideas trending this week.',
            url: 'https://newsly.example.com/culture',
            image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=900&q=80',
            publishedAt: now,
            source: { name: 'Newsly Culture' }
          }
        ],
        totalArticles: 6,
        error: 'Using sample data - live headlines unavailable (set GNEWS_API_KEY)'
      });
    }
  });

  // Get regional news
  router.get('/regional/:location', async (req, res) => {
    try {
      const location = req.params.location.toLowerCase();
      const stateParams = stateMapping[location] || stateMapping['maharashtra'];

      // Call GNews search with language + query for the region
      const response = await axios.get(`${GNEWS_API_BASE}/search`, {
        params: {
          apikey: GNEWS_API_KEY,
          lang: stateParams.lang,
          country: 'in',
          q: stateParams.q,
          max: 12
        }
      });

      res.json({
        location,
        stateParams,
        articles: response.data.articles || [],
        totalArticles: response.data.totalArticles || 0
      });
    } catch (error) {
      console.error('Regional GNews Error:', error.message);
      const now = new Date().toISOString();
      // Provide localized fallback set if API blocked/missing key
      res.json({
        location: req.params.location.toLowerCase(),
        stateParams: stateMapping[req.params.location.toLowerCase()] || stateMapping['maharashtra'],
        articles: [
          {
            title: 'प्रादेशिक शीर्ष बातम्या',
            description: 'आपल्या प्रदेशातील महत्वाच्या घडामोडींचा जलद आढावा.',
            url: 'https://newsly.example.com/regional/1',
            image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80',
            publishedAt: now,
            source: { name: 'Newsly Regional' }
          },
          {
            title: 'ಸ್ಥಳೀಯ ಸುದ್ದಿಗಳ ಸಂಗ್ರಹ',
            description: 'ನಿಮ್ಮ ರಾಜ್ಯದ ಪ್ರಮುಖ ಸುದ್ದಿಗಳ ತುಂಟುರು ಓದು.',
            url: 'https://newsly.example.com/regional/2',
            image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=900&q=80',
            publishedAt: now,
            source: { name: 'Newsly Regional' }
          },
          {
            title: 'தமிழ் முக்கிய செய்திகள்',
            description: 'உங்கள் மாநிலத்தில் நடந்த முக்கிய செய்திகள் துல்லியமாக.',
            url: 'https://newsly.example.com/regional/3',
            image: 'https://images.unsplash.com/photo-1520975922192-4baf2abd98c5?auto=format&fit=crop&w=900&q=80',
            publishedAt: now,
            source: { name: 'Newsly Regional' }
          }
        ],
        totalArticles: 3,
        error: 'Using localized sample data - live regional headlines unavailable (check GNEWS_API_KEY)'
      });
    }
  });

  // Search news by free-text query
  router.get('/search', async (req, res) => {
    const query = (req.query.q || '').trim();
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    try {
      const response = await axios.get(`${GNEWS_API_BASE}/search`, {
        params: {
          apikey: GNEWS_API_KEY,
          q: query,
          lang: 'en',
          country: 'in',
          max: 12
        }
      });
      res.json({
        articles: response.data.articles || [],
        totalArticles: response.data.totalArticles || 0,
        query
      });
    } catch (error) {
      console.error('Search GNews Error:', error.message);
      res.json({
        articles: [],
        totalArticles: 0,
        query,
        error: 'Search unavailable right now. Please retry shortly.'
      });
    }
  });

  // Category/topic news
  router.get('/category', async (req, res) => {
    const rawTopic = (req.query.topic || '').toLowerCase();
    const topic = topicMapping[rawTopic];
    // If no topic mapping, fall back to headlines
    if (!topic) {
      try {
        const response = await axios.get(`${GNEWS_API_BASE}/top-headlines`, {
          params: {
            apikey: GNEWS_API_KEY,
            lang: 'en',
            country: 'in',
            max: 12
          }
        });
        return res.json({
          articles: response.data.articles || [],
          totalArticles: response.data.totalArticles || 0,
          topic: 'top stories'
        });
      } catch (error) {
        console.error('Headlines fallback error:', error.message);
        return res.json({
          articles: [],
          totalArticles: 0,
          topic: 'top stories',
          error: 'Headlines unavailable right now. Please retry shortly.'
        });
      }
    }
    try {
      const response = await axios.get(`${GNEWS_API_BASE}/top-headlines`, {
        params: {
          apikey: GNEWS_API_KEY,
          topic,
          lang: 'en',
          country: 'in',
          max: 12
        }
      });
      res.json({
        articles: response.data.articles || [],
        totalArticles: response.data.totalArticles || 0,
        topic
      });
    } catch (error) {
      console.error('Category GNews Error:', error.message);
      res.json({
        articles: [],
        totalArticles: 0,
        topic,
        error: 'Category feed unavailable right now. Please retry shortly.'
      });
    }
  });

  // Get about us content
  router.get('/about', (req, res) => {
    res.json({
      title: 'About Newsly',
      content: 'Newsly is your go-to platform for reading regional newspapers and news from across India in your preferred language.'
    });
  });

  // Get contact us info
  router.get('/contact', (req, res) => {
    res.json({
      title: 'Contact Us',
      email: 'contact@newsly.com',
      phone: '+91-XXXXXXXXXX',
      address: 'India'
    });
  });

  return router;
};
