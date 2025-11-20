# WhatsApp Message Scheduler

A monorepo application for scheduling WhatsApp messages with a NestJS backend and Next.js frontend.

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](docker-compose.yml)
[![Node](https://img.shields.io/badge/Node-18%2B-green.svg)](package.json)

## 📚 Documentation

- **[Setup Guide](SETUP.md)** - Detailed installation and configuration instructions
- **[Architecture](ARCHITECTURE.md)** - System design and technical documentation
- **[Contributing](CONTRIBUTING.md)** - Development guidelines and contribution process
- **[Troubleshooting](TROUBLESHOOTING.md)** - Common issues and solutions
- **[Screenshots](SCREENSHOTS.md)** - UI/UX documentation
- **[Changelog](CHANGELOG.md)** - Version history and updates

## Features

- 🔐 WhatsApp Web authentication via QR code
- 📱 Contact list display
- 📅 Schedule messages for future delivery
- ⏰ Automatic message sending via cron jobs
- 🗄️ PostgreSQL database for message persistence
- 🐳 Fully containerized with Docker

## Tech Stack

### Backend (NestJS)
- NestJS framework
- TypeORM for database management
- PostgreSQL database
- whatsapp-web.js for WhatsApp integration
- Schedule module for cron jobs

### Frontend (Next.js)
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- QR code display for WhatsApp authentication
- Responsive UI

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ (for local development)

### Running with Docker Compose

#### Option 1: Using the Quick Start Script (Recommended)

```bash
git clone https://github.com/ThiagoCarreiraVallim/scheduler.git
cd scheduler
./start.sh
```

The script will:
- Check if Docker is installed
- Create environment files
- Build and start all containers
- Display the application URLs

To stop the application:
```bash
./stop.sh
```

#### Option 2: Manual Docker Compose

1. Clone the repository:
```bash
git clone https://github.com/ThiagoCarreiraVallim/scheduler.git
cd scheduler
```

2. Start all services:
```bash
docker-compose up -d
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

4. Scan the QR code with WhatsApp to connect

### Local Development

#### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run start:dev
```

#### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## How to Use

1. **Connect WhatsApp**: Open the app and scan the QR code with your WhatsApp mobile app
2. **Select Contact**: Once connected, browse your contacts and click on the one you want to message
3. **Schedule Message**: Enter your message, select date and time, and click "Schedule Message"
4. **View Scheduled Messages**: Switch to "My Scheduled Messages" tab to see all scheduled messages

## Project Structure

```
scheduler/
├── backend/              # NestJS backend
│   ├── src/
│   │   ├── whatsapp/    # WhatsApp integration module
│   │   ├── scheduled-messages/  # Message scheduling module
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   └── package.json
├── frontend/            # Next.js frontend
│   ├── app/
│   │   ├── components/  # React components
│   │   └── page.tsx     # Main page
│   ├── lib/            # API client
│   ├── types/          # TypeScript types
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml   # Docker orchestration
```

## API Endpoints

### WhatsApp
- `GET /whatsapp/qr` - Get QR code for authentication
- `GET /whatsapp/status` - Check connection status
- `GET /whatsapp/contacts` - Get contact list

### Scheduled Messages
- `POST /scheduled-messages` - Create a scheduled message
- `GET /scheduled-messages` - Get all scheduled messages
- `GET /scheduled-messages/pending` - Get pending messages
- `DELETE /scheduled-messages/:id` - Delete a scheduled message

## Environment Variables

### Backend (.env)
```
PORT=3001
FRONTEND_URL=http://localhost:3000
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=scheduler
DB_PASSWORD=scheduler
DB_DATABASE=scheduler
```

### Frontend (.env)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Database Schema

### scheduled_messages
- `id` - UUID primary key
- `contactId` - WhatsApp contact ID
- `contactName` - Contact display name
- `message` - Message content
- `scheduledAt` - Scheduled delivery time
- `status` - pending | sent | failed
- `errorMessage` - Error details (if failed)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## Need Help?

- 📖 Read the [Setup Guide](SETUP.md) for detailed installation instructions
- 🔧 Check the [Troubleshooting Guide](TROUBLESHOOTING.md) for common issues
- 🏗️ See the [Architecture Documentation](ARCHITECTURE.md) for technical details
- 💬 Open an [issue](https://github.com/ThiagoCarreiraVallim/scheduler/issues) if you need support

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) to get started.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This project uses an unofficial WhatsApp API (whatsapp-web.js). Use at your own risk. The authors are not responsible for any misuse or violations of WhatsApp's Terms of Service.

## Acknowledgments

- [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) - WhatsApp Web API
- [NestJS](https://nestjs.com/) - Backend framework
- [Next.js](https://nextjs.org/) - Frontend framework
