# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-11-20

### Added
- Initial release of WhatsApp Message Scheduler
- NestJS backend with WhatsApp Web.js integration
- Next.js frontend with modern UI
- PostgreSQL database for message persistence
- QR code authentication for WhatsApp
- Contact list display with search functionality
- Message scheduling with date/time picker
- Scheduled messages list with status tracking
- Automated cron job for message delivery (runs every minute)
- Docker and Docker Compose configuration
- Complete documentation (README, SETUP, CONTRIBUTING, ARCHITECTURE, TROUBLESHOOTING, SCREENSHOTS)
- Quick start and stop scripts
- Security scan with CodeQL

### Features
- 🔐 WhatsApp Web authentication via QR code
- 📱 Contact list display
- 📅 Schedule messages for future delivery
- ⏰ Automatic message sending via cron jobs
- 🗄️ PostgreSQL database for message persistence
- 🐳 Fully containerized with Docker
- 📊 Status tracking (pending, sent, failed)
- 🔍 Contact search functionality
- 📝 Message validation
- 🔄 Auto-refresh for QR code and messages list
- 🎨 Responsive UI with Tailwind CSS

### Technical Stack
- Backend: NestJS 11, TypeORM, PostgreSQL, whatsapp-web.js
- Frontend: Next.js 15, React, TypeScript, Tailwind CSS
- DevOps: Docker, Docker Compose
- Security: CodeQL scanning, input validation, CORS

### Documentation
- README.md with features and quick start
- SETUP.md with detailed installation guide
- CONTRIBUTING.md with development guidelines
- ARCHITECTURE.md with system design
- TROUBLESHOOTING.md with common issues
- SCREENSHOTS.md with UI documentation
- LICENSE file (ISC)

## [Unreleased]

### Planned Features
- User authentication and authorization
- Message templates
- Recurring message scheduling
- Message attachments support
- Group message support
- Multi-user/multi-tenant support
- Message analytics and reporting
- Webhook notifications
- API for third-party integrations
- Mobile app version
- Dark mode
- Internationalization (i18n)

### Known Issues
- WhatsApp session may disconnect after long inactivity
- No support for media attachments yet
- Single WhatsApp connection per deployment
- No user authentication (anyone with access can schedule messages)

### Future Improvements
- Add unit and integration tests
- Implement message queuing with Redis
- Add rate limiting for API endpoints
- Implement caching layer
- Add WebSocket support for real-time updates
- Improve error handling and user feedback
- Add database migrations
- Implement backup and restore functionality
- Add monitoring and logging solutions
- Performance optimizations

---

## Version History

- **v1.0.0** - Initial release with core features
