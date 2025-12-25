const axios = require('axios');
const { load } = require('cheerio');

// Mock epaper data - Replace with actual scraping or database
const epapers = {
  'times-of-india': {
    id: 'times-of-india',
    name: 'Times of India',
    url: 'https://timesofindia.indiatimes.com/epaper',
    language: 'english',
    image: '/images/Hindustan%20times.png'
  },
  'maharashtra-times': {
    id: 'maharashtra-times',
    name: 'Maharashtra Times',
    url: 'https://epaper.maharashtratimes.com/',
    language: 'marathi',
    image: '/images/divya%20marathi.png'
  },
  'dainik-bhaskar': {
    id: 'dainik-bhaskar',
    name: 'Dainik Bhaskar',
    url: 'https://www.bhaskar.com/epaper/',
    language: 'hindi',
    image: '/images/dainik%20bhaskar.png'
  },
  'hindu': {
    id: 'hindu',
    name: 'The Hindu',
    url: 'https://www.thehindu.com/epaper/',
    language: 'english',
    image: '/images/The%20hindu.jpg'
  },
  'deccan-chronicle': {
    id: 'deccan-chronicle',
    name: 'Deccan Chronicle',
    url: 'https://www.deccanchronicle.com/epaper/',
    language: 'english',
    image: '/images/deccan.png'
  },
  'navbharat-times': {
    id: 'navbharat-times',
    name: 'Navbharat Times',
    url: 'https://epaper.navbharattimes.com/',
    language: 'hindi',
    image: '/images/navbharat.png'
  },
  'lokmat': {
    id: 'lokmat',
    name: 'Lokmat',
    url: 'https://www.lokmat.com/epaper/',
    language: 'marathi',
    image: '/images/lokmat.png'
  },
  'pudhari': {
    id: 'pudhari',
    name: 'Pudhari',
    url: 'https://www.pudhari.news/',
    language: 'marathi',
    image: '/images/pudhari.png'
  }
};

// PDF scraping function
async function getPdfLink(url) {
  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    };

    const response = await axios.get(url, { headers, timeout: 10000 });
    const $ = load(response.data);

    // Strategy 1: Direct PDF links
    const pdfLink = $('a[href*=".pdf"]').attr('href');
    if (pdfLink) return pdfLink;

    // Strategy 2: Download buttons
    const downloadLink = $('a:contains("Download"), a:contains("PDF")').attr('href');
    if (downloadLink) return downloadLink;

    // Strategy 3: Iframes
    const iframeSrc = $('iframe').attr('src');
    if (iframeSrc && iframeSrc.includes('.pdf')) return iframeSrc;

    // Strategy 4: Regex search
    const pdfMatches = response.data.match(/https?:\/\/[^\s<>"]+?\.pdf/);
    if (pdfMatches) return pdfMatches[0];

    return null;
  } catch (error) {
    console.error('Error fetching PDF:', error.message);
    return null;
  }
}

module.exports = (router) => {
  // Get all epapers
  router.get('/all', (req, res) => {
    res.json(epapers);
  });

  // Get specific epaper
  router.get('/:paperId', (req, res) => {
    const paper = epapers[req.params.paperId];
    if (!paper) {
      return res.status(404).json({ error: 'Epaper not found' });
    }
    res.json(paper);
  });

  // Get PDF link for epaper
  router.get('/:paperId/pdf', async (req, res) => {
    try {
      const paper = epapers[req.params.paperId];
      if (!paper) {
        return res.status(404).json({ error: 'Epaper not found' });
      }

      const pdfUrl = await getPdfLink(paper.url);
      res.json({ pdfUrl: pdfUrl || null });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to fetch PDF link' });
    }
  });

  return router;
};
