# Architecture Documentation

This document describes the architecture and design decisions for the WhatsApp Message Scheduler.

## System Overview

The WhatsApp Message Scheduler is a full-stack application built as a monorepo with three main components:

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
│                     (http://localhost:3000)                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP/REST
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    Frontend (Next.js)                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  - QR Code Display Component                        │   │
│  │  - Contacts List Component                          │   │
│  │  - Message Scheduler Component                      │   │
│  │  - Scheduled Messages List Component                │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ API Calls
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    Backend (NestJS)                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  WhatsApp Module                                    │   │
│  │  - whatsapp-web.js Client                          │   │
│  │  - QR Code Generation                              │   │
│  │  - Contact Management                              │   │
│  │  - Message Sending                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Scheduled Messages Module                          │   │
│  │  - CRUD Operations                                  │   │
│  │  - Cron Job (runs every minute)                    │   │
│  │  - Status Management                               │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ TypeORM
                         │
┌────────────────────────▼────────────────────────────────────┐
│                PostgreSQL Database                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  scheduled_messages table                           │   │
│  │  - id (UUID)                                        │   │
│  │  - contactId, contactName                          │   │
│  │  - message, scheduledAt                            │   │
│  │  - status (pending/sent/failed)                    │   │
│  │  - errorMessage, timestamps                        │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Backend

**Framework:** NestJS 11
- Modern, TypeScript-first Node.js framework
- Excellent for building scalable APIs
- Built-in dependency injection
- Modular architecture

**Database:** PostgreSQL 15
- Reliable relational database
- ACID compliance for data integrity
- Excellent performance for read/write operations

**ORM:** TypeORM 0.3
- TypeScript-first ORM
- Entity-based data modeling
- Migration support
- Automatic schema synchronization

**WhatsApp Integration:** whatsapp-web.js
- Unofficial WhatsApp Web API
- QR code authentication
- Message sending capabilities
- Contact management

**Task Scheduling:** @nestjs/schedule
- Cron-based task scheduling
- Runs every minute to check for messages to send
- Built on node-cron

### Frontend

**Framework:** Next.js 15
- React-based framework
- App Router for modern routing
- Server-side rendering capabilities
- TypeScript support

**Styling:** Tailwind CSS
- Utility-first CSS framework
- Responsive design
- Consistent styling
- Easy customization

**HTTP Client:** Axios
- Promise-based HTTP client
- Request/response interceptors
- Automatic JSON transformation

**QR Code:** qrcode.react
- React component for QR code display
- SVG-based rendering
- High quality output

### DevOps

**Containerization:** Docker
- Consistent development environment
- Easy deployment
- Resource isolation

**Orchestration:** Docker Compose
- Multi-container application management
- Service dependencies
- Volume management
- Network isolation

## Module Architecture

### Backend Modules

#### 1. App Module (Root)
```typescript
@Module({
  imports: [
    ConfigModule,      // Environment configuration
    TypeOrmModule,     // Database connection
    ScheduleModule,    // Cron jobs
    WhatsappModule,    // WhatsApp integration
    ScheduledMessagesModule  // Message scheduling
  ]
})
```

#### 2. WhatsApp Module
**Responsibilities:**
- Initialize WhatsApp client on module startup
- Generate and provide QR code for authentication
- Maintain WhatsApp connection
- Fetch and cache contacts
- Send messages to WhatsApp

**Key Components:**
- `WhatsappService`: Core business logic
- `WhatsappController`: REST API endpoints
- Event handlers for QR, ready, authenticated, disconnected

**API Endpoints:**
- `GET /whatsapp/qr` - Get QR code
- `GET /whatsapp/status` - Check connection status
- `GET /whatsapp/contacts` - Fetch contacts

#### 3. Scheduled Messages Module
**Responsibilities:**
- CRUD operations for scheduled messages
- Cron job for sending scheduled messages
- Status management (pending/sent/failed)
- Error handling and logging

**Key Components:**
- `ScheduledMessagesService`: Business logic and cron job
- `ScheduledMessagesController`: REST API endpoints
- `ScheduledMessage` entity: Database model
- `CreateScheduledMessageDto`: Validation

**API Endpoints:**
- `POST /scheduled-messages` - Create scheduled message
- `GET /scheduled-messages` - Get all messages
- `GET /scheduled-messages/pending` - Get pending messages
- `DELETE /scheduled-messages/:id` - Delete message

### Frontend Components

#### 1. QRCodeDisplay
**Purpose:** Display QR code for WhatsApp authentication

**Features:**
- Polls backend every 3 seconds for QR code
- Shows loading state
- Displays connection success
- Error handling

#### 2. ContactsList
**Purpose:** Display WhatsApp contacts

**Features:**
- Search/filter contacts
- Alphabetically sorted
- Click to select contact
- Shows contact avatar and details

#### 3. MessageScheduler
**Purpose:** Form for scheduling messages

**Features:**
- Message text input
- Date picker (minimum: today)
- Time picker
- Validation
- Submit handler
- Error display

#### 4. ScheduledMessagesList
**Purpose:** Display all scheduled messages

**Features:**
- List all messages with status
- Auto-refresh every 30 seconds
- Delete pending messages
- Status badges
- Error messages for failed sends

## Data Flow

### 1. Authentication Flow
```
User opens app
    ↓
Frontend polls /whatsapp/qr
    ↓
Backend generates QR code
    ↓
User scans with phone
    ↓
WhatsApp authenticates
    ↓
Backend loads contacts
    ↓
Frontend shows contact list
```

### 2. Message Scheduling Flow
```
User selects contact
    ↓
User enters message and time
    ↓
Frontend sends POST /scheduled-messages
    ↓
Backend validates and saves to database
    ↓
Message status: PENDING
    ↓
Frontend shows confirmation
```

### 3. Message Sending Flow
```
Cron job runs every minute
    ↓
Query database for pending messages where scheduledAt <= now
    ↓
For each message:
    ↓
    Try to send via WhatsApp
    ↓
    Success → Update status to SENT
    ↓
    Failure → Update status to FAILED with error
```

## Database Schema

### scheduled_messages Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| contactId | VARCHAR | WhatsApp contact ID |
| contactName | VARCHAR | Contact display name |
| message | TEXT | Message content |
| scheduledAt | TIMESTAMP | When to send |
| status | ENUM | pending, sent, failed |
| errorMessage | VARCHAR | Error if failed |
| createdAt | TIMESTAMP | Creation time |
| updatedAt | TIMESTAMP | Last update time |

**Indexes:**
- Primary key on `id`
- Index on `status` for filtering
- Index on `scheduledAt` for cron job queries

## Design Decisions

### 1. Monorepo Structure
**Decision:** Keep backend and frontend in same repository

**Rationale:**
- Easier development and deployment
- Shared types and interfaces
- Simplified CI/CD
- Better for small to medium projects

### 2. Polling vs WebSockets
**Decision:** Use polling for QR code updates

**Rationale:**
- Simpler implementation
- QR code updates are infrequent
- Reduces complexity
- Easier to debug

### 3. Cron Job Frequency
**Decision:** Run every minute

**Rationale:**
- Balance between accuracy and resource usage
- Most scheduling scenarios don't need second-precision
- Reduces database load
- Standard cron pattern

### 4. Session Storage
**Decision:** Store WhatsApp session in Docker volume

**Rationale:**
- Persist across container restarts
- Avoid repeated QR code scans
- Better user experience
- Manageable with docker-compose

### 5. Database Choice
**Decision:** PostgreSQL over MongoDB

**Rationale:**
- Structured data fits relational model
- ACID compliance important for scheduling
- Better query capabilities
- Mature ecosystem

## Security Considerations

### Current Implementation

1. **CORS:** Enabled for frontend origin
2. **Input Validation:** Using class-validator
3. **Environment Variables:** Sensitive data in .env
4. **Docker User:** Non-root user in containers

### Future Enhancements

1. Add authentication for API endpoints
2. Implement rate limiting
3. Add API key for frontend-backend communication
4. Encrypt WhatsApp session data
5. Add audit logging
6. Implement HTTPS/TLS
7. Add input sanitization for XSS prevention

## Scalability Considerations

### Current Limitations

1. Single WhatsApp connection
2. Single backend instance
3. No message queuing
4. No load balancing

### Scaling Options

1. **Horizontal Scaling:**
   - Multiple backend instances with load balancer
   - Shared PostgreSQL database
   - Redis for session sharing

2. **Message Queue:**
   - Use RabbitMQ or Redis for message queuing
   - Separate worker processes for sending
   - Better failure handling

3. **Caching:**
   - Redis cache for contacts
   - Reduce database queries
   - Faster API responses

4. **Multi-tenancy:**
   - Support multiple WhatsApp accounts
   - User authentication
   - Isolated sessions per user

## Performance Optimization

### Current Optimizations

1. Connection pooling for PostgreSQL
2. Indexed database queries
3. Minimal frontend bundle size
4. Static page generation where possible

### Future Optimizations

1. Implement caching layer
2. Lazy load frontend components
3. Optimize Docker images
4. Add CDN for static assets
5. Database query optimization
6. Implement pagination for large lists

## Testing Strategy

### Recommended Testing

1. **Unit Tests:**
   - Service logic
   - DTO validation
   - Utility functions

2. **Integration Tests:**
   - API endpoints
   - Database operations
   - WhatsApp integration (mocked)

3. **E2E Tests:**
   - Full user workflows
   - UI interactions
   - Cross-browser testing

4. **Load Tests:**
   - Concurrent message scheduling
   - Database performance
   - API response times

## Deployment Options

### 1. Docker Compose (Recommended for Development)
- Easy setup
- All-in-one solution
- Good for testing

### 2. Kubernetes (Production)
- Better scaling
- High availability
- Advanced orchestration

### 3. Cloud Platforms
- AWS (ECS, RDS, S3)
- Google Cloud (Cloud Run, Cloud SQL)
- Azure (App Service, SQL Database)

### 4. VPS Deployment
- DigitalOcean, Linode, Vultr
- Docker Compose on VPS
- Reverse proxy (Nginx)
- SSL with Let's Encrypt

## Maintenance

### Regular Tasks

1. Monitor logs for errors
2. Check database size
3. Update dependencies
4. Backup WhatsApp session
5. Monitor message delivery rates

### Backup Strategy

1. **Database:** Daily backups
2. **WhatsApp Session:** After successful connection
3. **Configuration:** Version control

## Future Roadmap

### Phase 1 (Current)
- [x] Basic message scheduling
- [x] QR code authentication
- [x] Contact management
- [x] Docker deployment

### Phase 2
- [ ] User authentication
- [ ] Message templates
- [ ] Recurring messages
- [ ] Better error handling

### Phase 3
- [ ] Multi-user support
- [ ] Message analytics
- [ ] Webhook notifications
- [ ] Message attachments

### Phase 4
- [ ] Group message support
- [ ] Advanced scheduling options
- [ ] API for integrations
- [ ] Mobile app

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines and contribution process.

## License

ISC License - See LICENSE file for details.
