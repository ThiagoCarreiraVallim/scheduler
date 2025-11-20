# Troubleshooting Guide

This guide helps you resolve common issues with the WhatsApp Message Scheduler.

## Table of Contents
- [Installation Issues](#installation-issues)
- [Connection Issues](#connection-issues)
- [Message Sending Issues](#message-sending-issues)
- [Docker Issues](#docker-issues)
- [Database Issues](#database-issues)
- [Performance Issues](#performance-issues)

## Installation Issues

### Docker not found

**Problem:** Error message "Docker is not installed"

**Solution:**
1. Install Docker Desktop from https://docs.docker.com/get-docker/
2. Verify installation: `docker --version`
3. Start Docker Desktop application
4. Try running the application again

### Docker Compose not found

**Problem:** Error message "Docker Compose is not installed"

**Solution:**
1. Docker Desktop includes Docker Compose
2. If using Docker Engine, install Compose separately:
   ```bash
   sudo apt-get install docker-compose-plugin
   ```
3. Verify installation: `docker-compose --version`

### Permission denied errors

**Problem:** "Permission denied" when running Docker commands

**Solution (Linux):**
```bash
sudo usermod -aG docker $USER
newgrp docker
```

**Solution (Windows/Mac):**
- Make sure Docker Desktop is running
- Run terminal/command prompt as administrator

## Connection Issues

### QR Code not appearing

**Problem:** QR code doesn't show up on the screen

**Solutions:**

1. Check if backend is running:
   ```bash
   curl http://localhost:3001/whatsapp/qr
   ```

2. Check backend logs:
   ```bash
   docker-compose logs backend
   ```

3. Restart backend service:
   ```bash
   docker-compose restart backend
   ```

4. If using Chromium issues, check logs for browser errors

### QR Code expires quickly

**Problem:** QR code expires before you can scan it

**Solutions:**

1. The QR code auto-refreshes every 3 seconds
2. Keep the page open and wait for the next QR code
3. Make sure you have a stable internet connection
4. Try using a different browser

### "WhatsApp client is not ready" error

**Problem:** Error when trying to access contacts or send messages

**Solutions:**

1. Wait a few seconds after scanning the QR code
2. Check connection status:
   ```bash
   curl http://localhost:3001/whatsapp/status
   ```

3. Restart backend:
   ```bash
   docker-compose restart backend
   ```

4. Clear WhatsApp session and reconnect:
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

### Connection drops frequently

**Problem:** WhatsApp keeps disconnecting

**Solutions:**

1. Check your internet connection stability
2. Ensure your phone is connected to the internet
3. Don't use WhatsApp Web on other devices simultaneously
4. Check backend logs for errors:
   ```bash
   docker-compose logs -f backend
   ```

## Message Sending Issues

### Messages not being sent

**Problem:** Scheduled messages remain in "pending" status

**Solutions:**

1. Check if scheduled time has passed
2. Verify WhatsApp connection:
   ```bash
   curl http://localhost:3001/whatsapp/status
   ```

3. Check cron job logs:
   ```bash
   docker-compose logs backend | grep "Checking for scheduled messages"
   ```

4. Verify message details in database:
   ```bash
   docker exec -it scheduler-postgres psql -U scheduler -d scheduler -c "SELECT * FROM scheduled_messages WHERE status = 'pending';"
   ```

### Messages marked as "failed"

**Problem:** Messages show "failed" status with error

**Solutions:**

1. Read the error message in the UI
2. Common errors:
   - "WhatsApp client is not ready" - Reconnect WhatsApp
   - "Invalid contact" - Verify contact ID
   - "Message too long" - Shorten the message

3. Check backend logs for detailed error:
   ```bash
   docker-compose logs backend | grep "Failed to send"
   ```

### Wrong time zone for scheduled messages

**Problem:** Messages sent at wrong time

**Solutions:**

1. Check your system timezone
2. The backend uses UTC by default
3. Adjust scheduled time according to your timezone
4. Or set timezone in docker-compose.yml:
   ```yaml
   backend:
     environment:
       TZ: America/Sao_Paulo  # Your timezone
   ```

## Docker Issues

### Port already in use

**Problem:** "Port 3000/3001/5432 is already in use"

**Solutions:**

1. Stop conflicting services:
   ```bash
   # Find process using the port
   lsof -i :3000
   lsof -i :3001
   lsof -i :5432
   
   # Kill the process
   kill -9 <PID>
   ```

2. Change ports in docker-compose.yml:
   ```yaml
   frontend:
     ports:
       - "3002:3000"  # External:Internal
   ```

### Out of disk space

**Problem:** "No space left on device"

**Solutions:**

1. Remove unused Docker images:
   ```bash
   docker system prune -a
   ```

2. Remove unused volumes:
   ```bash
   docker volume prune
   ```

3. Check disk usage:
   ```bash
   docker system df
   ```

### Container keeps restarting

**Problem:** Container status shows "Restarting"

**Solutions:**

1. Check container logs:
   ```bash
   docker-compose logs <service-name>
   ```

2. Remove and rebuild:
   ```bash
   docker-compose down
   docker-compose up --build
   ```

3. Check for configuration errors in .env files

## Database Issues

### Cannot connect to database

**Problem:** Backend cannot connect to PostgreSQL

**Solutions:**

1. Wait for database to be ready (10-15 seconds)
2. Check database health:
   ```bash
   docker-compose ps postgres
   ```

3. Check database logs:
   ```bash
   docker-compose logs postgres
   ```

4. Verify credentials in backend/.env

### Database migration errors

**Problem:** TypeORM synchronization errors

**Solutions:**

1. Drop and recreate database:
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

2. Connect to database and check tables:
   ```bash
   docker exec -it scheduler-postgres psql -U scheduler -d scheduler
   \dt
   ```

3. Check entity definitions in backend code

### Lost data after restart

**Problem:** Scheduled messages disappear after restart

**Solutions:**

1. Check if volumes are persisted:
   ```bash
   docker volume ls | grep scheduler
   ```

2. Don't use `-v` flag when stopping:
   ```bash
   docker-compose down  # Keeps volumes
   # NOT: docker-compose down -v  # Removes volumes
   ```

## Performance Issues

### Slow QR code loading

**Problem:** QR code takes long to appear

**Solutions:**

1. Check internet connection
2. Check backend startup logs
3. Increase backend resources in docker-compose.yml:
   ```yaml
   backend:
     deploy:
       resources:
         limits:
           memory: 512M
   ```

### Frontend slow to load

**Problem:** Website loads slowly

**Solutions:**

1. Clear browser cache
2. Check network requests in browser DevTools
3. Verify frontend container is running:
   ```bash
   docker-compose ps frontend
   ```

### High memory usage

**Problem:** Docker consuming too much memory

**Solutions:**

1. Set resource limits in docker-compose.yml
2. Reduce number of worker processes
3. Monitor with:
   ```bash
   docker stats
   ```

## Getting More Help

If you're still experiencing issues:

1. **Check existing issues:** https://github.com/ThiagoCarreiraVallim/scheduler/issues
2. **Create a new issue** with:
   - Detailed description of the problem
   - Steps to reproduce
   - Error messages from logs
   - Your environment (OS, Docker version, Node version)
   - Screenshots if relevant

3. **Gather diagnostic information:**
   ```bash
   # System info
   docker --version
   docker-compose --version
   
   # Service status
   docker-compose ps
   
   # Recent logs
   docker-compose logs --tail=50
   
   # Disk usage
   docker system df
   ```

## Common Log Messages

### Normal messages (not errors):

- "Initializing WhatsApp client..." - Starting WhatsApp connection
- "QR Code received" - QR code is ready to scan
- "WhatsApp client is ready!" - Successfully connected
- "Checking for scheduled messages to send..." - Cron job running (every minute)
- "Found X messages to send" - Messages ready to be sent

### Warning messages:

- "No contacts found" - No WhatsApp contacts available yet
- "Failed to load contacts" - Contact sync issue (usually temporary)

### Error messages that need attention:

- "Failed to initialize WhatsApp client" - Critical startup error
- "Authentication failure" - QR code scan failed or expired
- "WhatsApp client disconnected" - Lost connection to WhatsApp
- "Error sending message" - Message delivery failed

Remember: Most connection issues resolve themselves by restarting the backend service or rescanning the QR code!
