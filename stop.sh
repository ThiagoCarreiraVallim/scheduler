#!/bin/bash

# WhatsApp Message Scheduler - Stop Script

echo "🛑 Stopping WhatsApp Message Scheduler..."
echo ""

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: Docker Compose is not installed."
    exit 1
fi

# Stop containers
docker-compose down

echo ""
echo "✅ Services stopped successfully!"
echo ""
echo "To remove all data (including WhatsApp session), run:"
echo "   docker-compose down -v"
echo ""
