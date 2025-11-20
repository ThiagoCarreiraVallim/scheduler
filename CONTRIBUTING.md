# Contributing Guide

Thank you for your interest in contributing to the WhatsApp Message Scheduler!

## Development Setup

### Prerequisites

- Node.js 18 or higher
- Docker and Docker Compose
- Git

### Setting Up the Project

1. Fork the repository on GitHub

2. Clone your fork:
```bash
git clone https://github.com/YOUR_USERNAME/scheduler.git
cd scheduler
```

3. Install dependencies for both backend and frontend:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## Project Structure

```
scheduler/
├── backend/              # NestJS backend application
│   ├── src/
│   │   ├── whatsapp/    # WhatsApp integration
│   │   ├── scheduled-messages/  # Message scheduling logic
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   └── package.json
├── frontend/            # Next.js frontend application
│   ├── app/
│   │   ├── components/  # React components
│   │   └── page.tsx
│   ├── lib/            # Utilities and API client
│   ├── types/          # TypeScript type definitions
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml   # Docker orchestration
```

## Making Changes

### Backend Development

1. Start PostgreSQL:
```bash
docker run -d --name scheduler-postgres \
  -e POSTGRES_USER=scheduler \
  -e POSTGRES_PASSWORD=scheduler \
  -e POSTGRES_DB=scheduler \
  -p 5432:5432 \
  postgres:15-alpine
```

2. Run the backend in development mode:
```bash
cd backend
npm run start:dev
```

The backend will auto-reload on file changes.

### Frontend Development

1. Run the frontend in development mode:
```bash
cd frontend
npm run dev
```

The frontend will auto-reload on file changes.

### Testing Changes

Build both applications to ensure there are no compilation errors:

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

## Code Style

### Backend (NestJS/TypeScript)

- Use TypeScript for all backend code
- Follow NestJS conventions and best practices
- Use dependency injection
- Organize code into modules
- Use DTOs for data validation
- Add proper error handling

### Frontend (Next.js/TypeScript)

- Use TypeScript for all frontend code
- Follow React and Next.js best practices
- Use functional components with hooks
- Keep components small and focused
- Use Tailwind CSS for styling
- Make UI responsive

## Commit Messages

Use clear and descriptive commit messages:

- `feat: add new feature`
- `fix: resolve bug in component`
- `docs: update documentation`
- `style: format code`
- `refactor: restructure module`
- `test: add tests`
- `chore: update dependencies`

## Pull Request Process

1. Create a new branch for your feature:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit them:
```bash
git add .
git commit -m "feat: add your feature"
```

3. Push to your fork:
```bash
git push origin feature/your-feature-name
```

4. Open a Pull Request on GitHub

5. Describe your changes clearly in the PR description

6. Wait for review and address any feedback

## Areas for Contribution

### High Priority

- [ ] Add authentication/authorization
- [ ] Implement message templates
- [ ] Add recurring message scheduling
- [ ] Improve error handling and user feedback
- [ ] Add message history and analytics
- [ ] Implement message drafts

### Medium Priority

- [ ] Add unit and integration tests
- [ ] Improve UI/UX design
- [ ] Add internationalization (i18n)
- [ ] Implement message queuing
- [ ] Add webhook support for notifications
- [ ] Create admin dashboard

### Low Priority

- [ ] Add support for group messages
- [ ] Implement message attachments
- [ ] Add dark mode
- [ ] Create mobile app version
- [ ] Add export functionality for messages

## Bug Reports

When reporting bugs, please include:

1. Clear description of the issue
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Screenshots (if applicable)
6. Environment details (OS, browser, Node version)

## Feature Requests

When requesting features, please include:

1. Clear description of the feature
2. Use case and benefits
3. Proposed implementation (if you have ideas)
4. Any relevant examples or mockups

## Questions?

If you have questions about contributing:

1. Check existing issues and discussions
2. Read the documentation
3. Open a new issue with the "question" label

## License

By contributing to this project, you agree that your contributions will be licensed under the ISC License.

## Code of Conduct

Please be respectful and constructive in all interactions. We aim to maintain a welcoming and inclusive community.

Thank you for contributing! 🎉
