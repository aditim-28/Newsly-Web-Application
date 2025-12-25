# Newsly

Modern news aggregator with live headlines, regional language filtering, and e-paper viewer.

## Stack
- Backend: Node.js + Express + MongoDB
- Frontend: React (create-react-app)
- Integration: GNews API, ipapi for location

## Development
```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd ../frontend
npm install
npm start
```

## Environment
Create `backend/.env` with your secrets (ignored by git):
```
PORT=5000
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/newsly_db
GNEWS_API_KEY=your_key
JWT_SECRET=your_secret
```

## Scripts
- Backend health: http://localhost:5000/health
- Frontend dev: http://localhost:3000

## License
Proprietary. All rights reserved.