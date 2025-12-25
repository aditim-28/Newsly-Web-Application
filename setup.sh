#!/bin/bash

# Quick Start Script for Linux/Mac

echo "========================================"
echo "Newsly React Application Setup"
echo "========================================"

# Create .env files if they don't exist
echo ""
echo "Setting up environment files..."

if [ ! -f "backend/.env" ]; then
    echo "Creating backend/.env..."
    cp "backend/.env.example" "backend/.env"
    echo "✓ Created backend/.env"
else
    echo "✓ backend/.env already exists"
fi

if [ ! -f "frontend/.env" ]; then
    echo "Creating frontend/.env..."
    cp "frontend/.env.example" "frontend/.env"
    echo "✓ Created frontend/.env"
else
    echo "✓ frontend/.env already exists"
fi

# Install backend dependencies
echo ""
echo "Installing backend dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
    echo "✓ Backend dependencies installed"
else
    echo "✗ Failed to install backend dependencies"
fi
cd ..

# Install frontend dependencies
echo ""
echo "Installing frontend dependencies..."
cd frontend
npm install
if [ $? -eq 0 ]; then
    echo "✓ Frontend dependencies installed"
else
    echo "✗ Failed to install frontend dependencies"
fi
cd ..

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Open two terminal windows"
echo "2. Terminal 1: cd backend && npm run dev"
echo "3. Terminal 2: cd frontend && npm start"
echo ""
echo "Application will be available at http://localhost:3000"
