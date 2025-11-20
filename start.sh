#!/bin/bash

# WhatsApp Message Scheduler - Quick Start Script

echo "🚀 Starting WhatsApp Message Scheduler..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed."
    echo "Please install Docker from https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: Docker Compose is not installed."
    echo "Please install Docker Compose from https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Create .env files if they don't exist
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend/.env from .env.example..."
    cp backend/.env.example backend/.env
fi

if [ ! -f frontend/.env ]; then
    echo "📝 Creating frontend/.env from .env.example..."
    cp frontend/.env.example frontend/.env
fi

echo ""
echo "🐳 Starting Docker containers..."
echo ""

# Build and start containers
docker-compose up --build -d

# Wait for services to be ready
echo ""
echo "⏳ Waiting for services to start..."
sleep 5

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "✅ Services started successfully!"
    echo ""
    echo "📱 Application URLs:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:3001"
    echo ""
    echo "📖 Next steps:"
    echo "   1. Open http://localhost:3000 in your browser"
    echo "   2. Scan the QR code with WhatsApp on your phone"
    echo "   3. Start scheduling messages!"
    echo ""
    echo "📋 Useful commands:"
    echo "   View logs:     docker-compose logs -f"
    echo "   Stop services: docker-compose down"
    echo "   Restart:       docker-compose restart"
    echo ""
else
    echo ""
    echo "❌ Error: Services failed to start"
    echo "Run 'docker-compose logs' to see error details"
    exit 1
fi
