# Setup Guide

This guide will help you set up and run the WhatsApp Message Scheduler.

## Prerequisites

- Docker and Docker Compose installed on your system
- WhatsApp installed on your mobile device
- Internet connection

## Running the Application

### Option 1: Using Docker Compose (Recommended)

This is the easiest way to run the entire application with all dependencies.

1. Clone the repository:
```bash
git clone https://github.com/ThiagoCarreiraVallim/scheduler.git
cd scheduler
```

2. Start all services:
```bash
docker-compose up --build
```

Wait for all services to start. You should see logs from:
- PostgreSQL database
- Backend API
- Frontend web server

3. Open your browser and navigate to:
```
http://localhost:3000
```

4. Follow the on-screen instructions to scan the QR code with WhatsApp

### Option 2: Local Development

If you want to run the services individually for development:

#### 1. Start PostgreSQL

You can use Docker for just the database:

```bash
docker run -d \
  --name scheduler-postgres \
  -e POSTGRES_USER=scheduler \
  -e POSTGRES_PASSWORD=scheduler \
  -e POSTGRES_DB=scheduler \
  -p 5432:5432 \
  postgres:15-alpine
```

#### 2. Start Backend

```bash
cd backend
npm install
cp .env.example .env
npm run start:dev
```

The backend will be available at `http://localhost:3001`

#### 3. Start Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The frontend will be available at `http://localhost:3000`

## First Time Setup

1. **Connect WhatsApp**:
   - Open the application in your browser
   - You'll see a QR code on the screen
   - Open WhatsApp on your phone
   - Go to Settings > Linked Devices > Link a Device
   - Scan the QR code shown on screen

2. **Wait for Synchronization**:
   - After scanning, wait for the contacts to load
   - This may take a few moments depending on the number of contacts

3. **Start Scheduling**:
   - Click on a contact from the list
   - Enter your message
   - Select date and time for delivery
   - Click "Schedule Message"

## Troubleshooting

### QR Code Not Appearing

- Check if the backend is running: `curl http://localhost:3001/whatsapp/qr`
- Check backend logs for errors: `docker-compose logs backend`
- Restart the backend service: `docker-compose restart backend`

### Contacts Not Loading

- Make sure you've successfully scanned the QR code
- Wait a few seconds for WhatsApp to synchronize
- Check backend logs: `docker-compose logs backend`

### Messages Not Being Sent

- Check if the scheduled time has passed
- Verify the backend cron job is running (check logs every minute)
- Ensure WhatsApp is still connected: `curl http://localhost:3001/whatsapp/status`

### Docker Issues

If you encounter Docker-related issues:

```bash
# Stop all containers
docker-compose down

# Remove volumes (will delete database data)
docker-compose down -v

# Rebuild and start fresh
docker-compose up --build
```

## Database Access

To access the PostgreSQL database directly:

```bash
docker exec -it scheduler-postgres psql -U scheduler -d scheduler
```

Useful SQL queries:

```sql
-- View all scheduled messages
SELECT * FROM scheduled_messages;

-- View pending messages
SELECT * FROM scheduled_messages WHERE status = 'pending';

-- View sent messages
SELECT * FROM scheduled_messages WHERE status = 'sent';
```

## Stopping the Application

To stop all services:

```bash
docker-compose down
```

To stop and remove all data (including WhatsApp session):

```bash
docker-compose down -v
```

## Security Notes

- The WhatsApp session data is stored in a Docker volume
- Keep your `.env` files secure and never commit them to version control
- Use strong passwords for production deployments
- Consider using environment-specific configurations for different deployment stages

## Next Steps

- Read the main README.md for API documentation
- Check out the code in `backend/src` and `frontend/app`
- Customize the UI to match your preferences
- Add additional features as needed
