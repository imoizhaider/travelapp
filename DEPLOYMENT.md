# Travel Planner — Enterprise Production Deployment Guide

**Architect:** DevOps Engineering  
**Target:** Ubuntu Server 22.04+  
**Stack:** React + Express.js + PostgreSQL + Nginx + PM2  
**SSL:** Let's Encrypt (Certbot)  
**Updated:** 2026-07-23

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Server Preparation](#2-server-preparation)
3. [Firewall Configuration](#3-firewall-configuration)
4. [Application Directory Setup](#4-application-directory-setup)
5. [Database Configuration](#5-database-configuration)
6. [Environment Configuration](#6-environment-configuration)
7. [Backend Deployment](#7-backend-deployment)
8. [PM2 Configuration](#8-pm2-configuration)
9. [Frontend Build & Deploy](#9-frontend-build--deploy)
10. [Nginx Configuration](#10-nginx-configuration)
11. [SSL Configuration](#11-ssl-configuration)
12. [Security Hardening](#12-security-hardening)
13. [Performance Optimization](#13-performance-optimization)
14. [Monitoring & Maintenance](#14-monitoring--maintenance)
15. [Deployment Verification](#15-deployment-verification)
16. [Rollback Strategy](#16-rollback-strategy)
17. [Troubleshooting Guide](#17-troubleshooting-guide)

---

## 1. Prerequisites

| Resource | Requirement |
|----------|-------------|
| OS | Ubuntu Server 22.04 LTS or 24.04 LTS |
| RAM | Minimum 1 GB (2 GB recommended) |
| Disk | 10 GB free |
| Domain | Fully qualified domain name (A record pointing to server IP) |
| Ports | 22 (SSH), 80 (HTTP), 443 (HTTPS) |
| User | Non-root sudo user (`deploy` recommended) |

### Required Domain DNS Records

```
travelplanner.example.com  A  <SERVER_IP>
```

---

## 2. Server Preparation

Execute all commands as a sudo user (not root).

### 2.1 System Update & Package Installation

```bash
# Update package index and upgrade all packages
sudo apt update && sudo apt upgrade -y

# Install essential build tools and utilities
sudo apt install -y \
  curl \
  wget \
  git \
  build-essential \
  software-properties-common \
  ufw \
  nginx \
  postgresql \
  postgresql-contrib \
  certbot \
  python3-certbot-nginx \
  htop \
  net-tools \
  fail2ban
```

### 2.2 Node.js Installation (via NodeSource)

```bash
# Add NodeSource repository for Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js and npm
sudo apt install -y nodejs

# Verify installation
node -v   # Expected: v20.x.x
npm -v    # Expected: 10.x.x
```

### 2.3 PM2 Installation (Global)

```bash
# Install PM2 process manager globally
sudo npm install -y pm2@latest

# Verify installation
pm2 --version   # Expected: 5.x.x
```

---

## 3. Firewall Configuration

```bash
# Configure UFW (Uncomplicated Firewall)
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (customize port if non-standard)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw --force enable

# Verify status
sudo ufw status verbose
```

### Expected Output
```
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
22/tcp (v6)                ALLOW       Anywhere (v6)
80/tcp (v6)                ALLOW       Anywhere (v6)
443/tcp (v6)               ALLOW       Anywhere (v6)
```

---

## 4. Application Directory Setup

```bash
# Create deployment user (if not exists)
sudo adduser deploy
sudo usermod -aG sudo deploy

# Switch to deploy user
sudo -i -u deploy
cd ~

# Create application directory structure
mkdir -p ~/travelapp/{backend,frontend}
mkdir -p ~/travelapp/backend/{src,logs}
mkdir -p ~/travelapp/frontend/build

# Set restricted permissions
chmod 750 ~/travelapp
chmod 750 ~/travelapp/backend
chmod 750 ~/travelapp/frontend
```

---

## 5. Database Configuration

### 5.1 PostgreSQL Setup

```bash
# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify service status
sudo systemctl status postgresql
```

### 5.2 Create Database and User

```bash
# Switch to postgres system user
sudo -i -u postgres

# Create database user (replace with strong password)
createuser --interactive --pwprompt travelapp_user
# Enter password when prompted: <GENERATE_STRONG_PASSWORD>

# Create production database
createdb -O travelapp_user travelapp_prod

# Exit postgres user
exit
```

### 5.3 Verify Connectivity

```bash
# Test connection to production database
PGPASSWORD='<PROD_DB_PASSWORD>' psql -h localhost -U travelapp_user -d travelapp_prod -c '\conninfo'
```

Expected output:
```
You are connected to database "travelapp_prod" as user "travelapp_user" on host "localhost" (address "127.0.0.1") at port "5432".
```

### 5.4 Database Schema & Seed

Retrieve the schema and seed files from the repository. The schema defines the following tables:

```
destinations, roles, users, itinerary_categories, budget_categories,
trips, favorites, weather_forecasts, hotels, mock_bookings,
itinerary_items, trip_budget_estimates, budget_items,
share_links, trip_collaborators
```

```bash
# Copy schema and seed files to server
# (Transfer via scp from development machine)

# Apply schema
PGPASSWORD='<PROD_DB_PASSWORD>' psql -h localhost -U travelapp_user -d travelapp_prod -f /path/to/schema.sql

# Apply seed data
PGPASSWORD='<PROD_DB_PASSWORD>' psql -h localhost -U travelapp_user -d travelapp_prod -f /path/to/seed.sql

# Verify tables
PGPASSWORD='<PROD_DB_PASSWORD>' psql -h localhost -U travelapp_user -d travelapp_prod -c '\dt'
```

### 5.5 Automated Backup Configuration

```bash
# Create backup script
sudo tee /usr/local/bin/backup-travelapp-db > /dev/null << 'SCRIPT'
#!/bin/bash
BACKUP_DIR="/var/backups/travelapp"
DB_NAME="travelapp_prod"
DB_USER="travelapp_user"
RETENTION_DAYS=7
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"

PGPASSWORD="${DB_PASSWORD}" pg_dump \
  -h localhost \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  -F c \
  -f "$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.dump" \
  -v 2>> "$BACKUP_DIR/backup.log"

# Compress
gzip "$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.dump"

# Clean old backups
find "$BACKUP_DIR" -name "${DB_NAME}_*.dump.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: ${DB_NAME}_${TIMESTAMP}.dump.gz"
SCRIPT

sudo chmod +x /usr/local/bin/backup-travelapp-db

# Set backup password via environment
echo 'DB_PASSWORD="<PROD_DB_PASSWORD>"' | sudo tee -a /etc/environment

# Schedule daily backup via cron
sudo crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-travelapp-db" | sudo crontab -
```

### 5.6 PostgreSQL Hardening

```bash
# Edit PostgreSQL configuration
sudo nano /etc/postgresql/*/main/pg_hba.conf
```

Ensure the following line (local socket and localhost only — no network exposure):
```
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             all                                     peer
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                 md5
```

```bash
# Edit PostgreSQL main config
sudo nano /etc/postgresql/*/main/postgresql.conf
```

Set these values:
```
listen_addresses = 'localhost'      # Do NOT bind to 0.0.0.0
max_connections = 50                # Adequate for this application
shared_buffers = 256MB              # 25% of available RAM (adjust)
work_mem = 4MB                      # Per-operation memory
maintenance_work_mem = 64MB         # For maintenance operations
effective_cache_size = 768MB        # 50-75% of available RAM
wal_level = replica                 # For point-in-time recovery
max_wal_size = 1GB
min_wal_size = 80MB
```

```bash
# Restart PostgreSQL to apply changes
sudo systemctl restart postgresql
```

---

## 6. Environment Configuration

### 6.1 Backend `.env` File

```bash
cat > ~/travelapp/backend/.env << 'ENVFILE'
# =============================================================================
# TRAVEL PLANNER — BACKEND PRODUCTION ENVIRONMENT
# =============================================================================

# Application
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=postgresql://travelapp_user:<PROD_DB_PASSWORD>@localhost:5432/travelapp_prod

# JWT
JWT_SECRET=<GENERATE_64_CHAR_RANDOM_STRING>
JWT_EXPIRES_IN=7d

# CORS — comma-separated list of allowed origins
CORS_ORIGIN=https://travelplanner.example.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=20

# Logging (optional: 'combined' for production, 'dev' for development)
LOG_FORMAT=combined
ENVFILE

# Secure the file
chmod 640 ~/travelapp/backend/.env
```

> **SECURITY**: Generate the JWT_SECRET using:
> ```bash
> openssl rand -base64 64 | tr -d '\n'
> ```

### 6.2 Frontend Build Environment Variable

The frontend uses `VITE_API_BASE_URL` at build time. This is embedded into the static JS bundle, so it must point to the production API URL.

```bash
# Create frontend env file (used during build)
cat > ~/travelapp/frontend/.env << 'ENVFILE'
VITE_API_BASE_URL=https://travelplanner.example.com/api
ENVFILE
```

> **Note**: Vite embeds env variables at build time. To change the API URL, you must rebuild the frontend.

---

## 7. Backend Deployment

### 7.1 Transfer Application Code

From your development machine:
```bash
# Clone or transfer code to server
git clone <REPOSITORY_URL> /tmp/travelapp-src

# Copy backend files
cp -r /tmp/travelapp-src/src ~/travelapp/backend/
cp /tmp/travelapp-src/package.json ~/travelapp/backend/
cp /tmp/travelapp-src/package-lock.json ~/travelapp/backend/

# Remove devDependencies from production install
cd ~/travelapp/backend
npm ci --only=production
```

> **Tip**: Use `scp -r` or `rsync -avz` for direct transfer if not using git.

### 7.2 Verify Backend Structure

```bash
ls -la ~/travelapp/backend/
# Expected:
# .env              (production env vars)
# package.json      (dependencies)
# node_modules/     (installed dependencies)
# src/              (application source)
# logs/             (application logs directory)
```

### 7.3 Database Schema Migration

Before starting the backend, ensure the database schema is applied:

```bash
cd ~/travelapp

# Source the schema file (delivered with the codebase)
PGPASSWORD='<PROD_DB_PASSWORD>' psql \
  -h localhost \
  -U travelapp_user \
  -d travelapp_prod \
  -f backend/src/db/schema.sql
```

---

## 8. PM2 Configuration

### 8.1 PM2 Ecosystem File

Create a production-ready PM2 ecosystem configuration:

```bash
cat > ~/travelapp/ecosystem.config.js << 'PM2CONFIG'
module.exports = {
  apps: [
    {
      name: 'travelapp-api',
      script: 'src/server.js',
      cwd: '/home/deploy/travelapp/backend',
      env: {
        NODE_ENV: 'production'
      },

      // Process Management
      instances: 1,
      exec_mode: 'fork',
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 5000,
      max_memory_restart: '500M',

      // Logging
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/home/deploy/travelapp/backend/logs/error.log',
      out_file: '/home/deploy/travelapp/backend/logs/out.log',
      merge_logs: true,
      log_type: 'json',

      // Graceful Shutdown
      kill_timeout: 5000,
      listen_timeout: 3000,

      // Watch & Auto-Reload
      watch: false,
      autorestart: true
    }
  ]
};
PM2CONFIG
```

### 8.2 Start Backend with PM2

```bash
cd ~/travelapp

# Start the API with PM2
pm2 start ecosystem.config.js

# Verify process status
pm2 status

# Save PM2 process list for automatic restart on boot
pm2 save

# Generate and configure startup script
pm2 startup systemd -u deploy --hp /home/deploy
# Execute the sudo command that PM2 outputs
```

### 8.3 PM2 Useful Commands

```bash
# Monitor processes in real-time
pm2 monit

# View logs
pm2 logs travelapp-api
pm2 logs travelapp-api --lines 100

# Restart application
pm2 restart travelapp-api

# Stop application
pm2 stop travelapp-api

# Delete process from PM2 list
pm2 delete travelapp-api

# List all processes
pm2 status

# Display detailed process info
pm2 show travelapp-api
```

---

## 9. Frontend Build & Deploy

### 9.1 Build Production Bundle

```bash
cd ~/travelapp/frontend

# Install dependencies
npm ci

# Build production bundle
npm run build

# Verify build output
ls -la build/
# Expected: index.html, assets/ directory with hashed filenames
```

### 9.2 Build Output Structure

```
build/
├── index.html                     # Entry point (200-500 bytes)
├── assets/
│   ├── index-<hash>.js            # Main JS bundle (~50-100 KB gzipped)
│   ├── index-<hash>.css           # Main CSS bundle (~10-30 KB gzipped)
│   └── vendor-<hash>.js           # Vendor dependencies (~100-200 KB gzipped)
└── favicon.ico                    # (if present)
```

### 9.3 Set Proper Ownership for Nginx

```bash
# Ensure Nginx can read the static files
sudo chown -R www-data:www-data ~/travelapp/frontend/build
sudo chmod -R 755 ~/travelapp/frontend/build
```

---

## 10. Nginx Configuration

### 10.1 Create Nginx Site Configuration

```bash
sudo tee /etc/nginx/sites-available/travelplanner > /dev/null << 'NGINXCONF'
# =============================================================================
# TRAVEL PLANNER — Nginx Production Configuration
# =============================================================================

upstream travelapp_api {
    server 127.0.0.1:5000;
    keepalive 32;
}

server {
    listen 80;
    server_name travelplanner.example.com;

    # ---- HTTP → HTTPS Redirect (activated after Certbot) ----
    # Initially serve on HTTP for Certbot validation.
    # After SSL is installed, Certbot will modify this block to redirect.
    # location / {
    #     return 301 https://$host$request_uri;
    # }

    # ---- Well-Known Challenge (always accessible) ----
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # ---- API Reverse Proxy ----
    location /api/ {
        proxy_pass http://travelapp_api;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
        proxy_busy_buffers_size 8k;

        proxy_read_timeout 30s;
        proxy_connect_timeout 10s;
        proxy_send_timeout 30s;

        # Rate limiting
        limit_req zone=login_limit burst=5 nodelay;
    }

    # ---- Health Check (no auth required) ----
    location /health {
        proxy_pass http://travelapp_api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        access_log off;
    }

    # ---- Backend Root ----
    location / {
        proxy_pass http://travelapp_api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # ---- Security Headers ----
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

    # ---- Compression ----
    gzip on;
    gzip_comp_level 6;
    gzip_min_length 1000;
    gzip_proxied any;
    gzip_types
        text/plain
        text/css
        text/javascript
        application/javascript
        application/json
        application/xml
        image/svg+xml
        font/woff
        font/woff2;
    gzip_vary on;
    gzip_disable "msie6";
}

# ---- Rate Limiting Zones ----
limit_req_zone $binary_remote_addr zone=login_limit:10m rate=10r/m;
NGINXCONF
```

### 10.2 Enable the Site

```bash
# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Enable Travel Planner site
sudo ln -sf /etc/nginx/sites-available/travelplanner /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 10.3 SPA Routing Configuration (if frontend is served by Nginx)

If you choose to serve the React frontend directly from Nginx (instead of a separate static host), replace the server block root location:

```bash
sudo tee /etc/nginx/sites-available/travelplanner > /dev/null << 'NGINXSPA'
# =============================================================================
# TRAVEL PLANNER — Nginx Production Configuration (Served Static Build)
# =============================================================================

upstream travelapp_api {
    server 127.0.0.1:5000;
    keepalive 32;
}

server {
    listen 80;
    server_name travelplanner.example.com;

    root /home/deploy/travelapp/frontend/build;
    index index.html;

    # ---- API Reverse Proxy ----
    location /api/ {
        proxy_pass http://travelapp_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
        proxy_busy_buffers_size 8k;
        proxy_read_timeout 30s;
        proxy_connect_timeout 10s;
        proxy_send_timeout 30s;
    }

    # ---- Health Check ----
    location /health {
        proxy_pass http://travelapp_api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        access_log off;
    }

    # ---- Static Assets (cached) ----
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # ---- SPA Fallback (all other routes → index.html) ----
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, must-revalidate";
    }

    # ---- Well-Known Challenge ----
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # ---- Security Headers ----
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # ---- Compression ----
    gzip on;
    gzip_comp_level 6;
    gzip_min_length 1000;
    gzip_proxied any;
    gzip_types
        text/plain text/css text/javascript
        application/javascript application/json
        application/xml image/svg+xml
        font/woff font/woff2;
    gzip_vary on;
    gzip_disable "msie6";
}
NGINXSPA
```

---

## 11. SSL Configuration

### 11.1 Obtain SSL Certificate

```bash
# Ensure ports 80 and 443 are open in firewall (already done above)
# Run Certbot to obtain and install certificate
sudo certbot --nginx -d travelplanner.example.com

# Follow the interactive prompts:
# - Enter email address (for renewal notices)
# - Agree to Terms of Service
# - Choose whether to redirect HTTP → HTTPS (recommended: Yes)
```

### 11.2 Verify Certificate

```bash
# Check certificate details
sudo certbot certificates

# Expected output:
# Found the following certificates:
#   Certificate Name: travelplanner.example.com
#     Domains: travelplanner.example.com
#     Expiry Date: 2026-10-21 12:34:56+00:00 (VALID: 90 days)
#     Certificate Path: /etc/letsencrypt/live/travelplanner.example.com/fullchain.pem
#     Private Key Path: /etc/letsencrypt/live/travelplanner.example.com/privkey.pem
```

### 11.3 Auto-Renewal

Certbot installs a systemd timer automatically. Verify:

```bash
# Check the renewal timer
sudo systemctl status certbot.timer

# Test renewal process (dry run)
sudo certbot renew --dry-run

# Expected: "Congratulations, all renewals succeeded."
```

If you chose not to redirect during Certbot setup, add the redirect manually:

```bash
# After Certbot, the Nginx config should contain:
# server {
#     listen 443 ssl;
#     ...
# }
# server {
#     listen 80;
#     return 301 https://$host$request_uri;
# }
```

---

## 12. Security Hardening

### 12.1 Fail2Ban Configuration

```bash
# Configure fail2ban for SSH protection
sudo tee /etc/fail2ban/jail.local > /dev/null << 'FAIL2BAN'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = ssh
logpath = %(sshd_log)s

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log

[nginx-botsearch]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 10
FAIL2BAN

# Restart fail2ban
sudo systemctl restart fail2ban
sudo systemctl enable fail2ban
```

### 12.2 Nginx Security Hardening

```bash
# Edit main Nginx configuration
sudo nano /etc/nginx/nginx.conf
```

Ensure these settings:
```nginx
user www-data;
worker_processes auto;
pid /run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    # Hide Nginx version
    server_tokens off;

    # Size limits
    client_max_body_size 1M;
    client_body_buffer_size 128k;

    # Timeouts
    client_body_timeout 12s;
    client_header_timeout 12s;
    keepalive_timeout 30s;
    send_timeout 10s;

    # SSL Configuration (modern profile)
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    # Buffer overflow protection
    large_client_header_buffers 4 16k;

    # Logging format
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main buffer=32k flush=5s;
    error_log /var/log/nginx/error.log warn;

    # Rate limiting zones
    limit_req_zone $binary_remote_addr zone=login_limit:10m rate=10r/m;
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=30r/m;

    # Gzip settings
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 1000;
    gzip_types text/plain text/css text/javascript application/javascript application/json application/xml image/svg+xml font/woff font/woff2;

    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

### 12.3 Backend CORS Configuration

The application already reads `CORS_ORIGIN` from the `.env` file:

```env
CORS_ORIGIN=https://travelplanner.example.com
```

For multiple domains (e.g., staging + production):
```env
CORS_ORIGIN=https://travelplanner.example.com,https://staging.travelplanner.example.com
```

### 12.4 Additional Security Measures

```bash
# Disable root SSH login
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart sshd

# Set proper umask
echo 'umask 027' | sudo tee -a /etc/profile

# Enable automatic security updates
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 12.5 Dependency Vulnerability Scanning

```bash
# Scan backend dependencies
cd ~/travelapp/backend
npm audit

# Scan frontend dependencies
cd ~/travelapp/frontend
npm audit

# For CI/CD, use `npm audit --audit-level=high` to fail builds on high/critical vulnerabilities
```

---

## 13. Performance Optimization

### 13.1 Frontend Optimization

The Vite production build already performs:
- JavaScript minification (terser)
- CSS minification
- Code splitting (lazy-loading routes)
- Asset hashing (cache busting)
- Tree shaking

Additional Nginx optimizations are applied in the configuration above:
- Gzip compression (level 6)
- Static asset caching (1-year expiration, immutable)
- SPA fallback (no filesystem lookups for API routes)
- Buffer and timeout tuning

### 13.2 Backend Optimization

The application already implements:
- Database connection pooling (max 20 connections)
- Request body size limits (1 MB)
- Morgan logging in combined format

Server-level tuning:
```bash
# Increase system file watchers (for large node_modules)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf

# Optimize network stack
cat << EOF | sudo tee -a /etc/sysctl.conf
# TCP optimization
net.ipv4.tcp_fastopen = 3
net.ipv4.tcp_tw_reuse = 1
net.core.somaxconn = 1024
net.ipv4.tcp_fin_timeout = 15

# Memory optimization
vm.swappiness = 10
vm.vfs_cache_pressure = 50
EOF

# Apply changes
sudo sysctl -p
```

### 13.3 PostgreSQL Performance Tuning

Based on the server's available resources, adjust the following in `/etc/postgresql/*/main/postgresql.conf`:

| Setting | 1 GB RAM | 2 GB RAM | 4 GB RAM |
|---------|----------|----------|----------|
| shared_buffers | 256 MB | 512 MB | 1 GB |
| effective_cache_size | 512 MB | 1 GB | 2 GB |
| work_mem | 4 MB | 8 MB | 16 MB |
| maintenance_work_mem | 64 MB | 128 MB | 256 MB |

### 13.4 PM2 Memory Management

The PM2 ecosystem file already includes `max_memory_restart: '500M'` which automatically restarts the backend if it exceeds 500 MB memory usage.

---

## 14. Monitoring & Maintenance

### 14.1 PM2 Monitoring

```bash
# Real-time monitoring dashboard (CPU, memory, loop delay)
pm2 monit

# Show process metadata
pm2 show travelapp-api

# List all processes with resource usage
pm2 status

# View last 100 log lines
pm2 logs travelapp-api --lines 100

# Flush logs (after rotation)
pm2 flush
```

### 14.2 Log Management

```bash
# Nginx access log
sudo tail -f /var/log/nginx/access.log

# Nginx error log
sudo tail -f /var/log/nginx/error.log

# Backend application logs
tail -f ~/travelapp/backend/logs/out.log
tail -f ~/travelapp/backend/logs/error.log

# PM2 process logs
pm2 logs travelapp-api

# System logs
sudo journalctl -u nginx -n 100
sudo journalctl -u postgresql -n 100
```

### 14.3 Server Resource Monitoring

```bash
# Real-time process viewer
htop

# Disk usage
df -h

# Memory usage
free -h

# Disk I/O
iostat -x 2

# Network connections
ss -tuln

# PostgreSQL activity
PGPASSWORD='<PROD_DB_PASSWORD>' psql -h localhost -U travelapp_user -d travelapp_prod -c "SELECT * FROM pg_stat_activity;"
```

### 14.4 Health Check Endpoints

```bash
# Test backend health
curl -s https://travelplanner.example.com/health | jq .
# Expected: {"success":true,"message":"Travel Planner API is running"}

# Test API accessibility
curl -s https://travelplanner.example.com/api/destinations | jq '.data | length'
# Expected: 6 (or whatever the seeded count is)

# Test HTTPS certificate
curl -vI https://travelplanner.example.com 2>&1 | grep "SSL certificate"
```

### 14.5 Database Maintenance

```bash
# Manual backup
sudo /usr/local/bin/backup-travelapp-db

# Vacuum analyze (weekly)
PGPASSWORD='<PROD_DB_PASSWORD>' psql -h localhost -U travelapp_user -d travelapp_prod -c "VACUUM ANALYZE;"

# Reindex (monthly)
PGPASSWORD='<PROD_DB_PASSWORD>' psql -h localhost -U travelapp_user -d travelapp_prod -c "REINDEX DATABASE travelapp_prod;"

# Check database size
PGPASSWORD='<PROD_DB_PASSWORD>' psql -h localhost -U travelapp_user -d travelapp_prod -c "
SELECT pg_database_size('travelapp_prod')/1024/1024 AS size_mb;
"
```

---

## 15. Deployment Verification

### 15.1 Checklist

Complete each step and mark when verified:

| # | Check | Command | Expected | Status |
|---|-------|---------|----------|--------|
| 1 | Nginx running | `sudo systemctl status nginx` | active (running) | ☐ |
| 2 | PostgreSQL running | `sudo systemctl status postgresql` | active (running) | ☐ |
| 3 | PM2 process running | `pm2 status` | online (1 process) | ☐ |
| 4 | HTTPS accessible | `curl -I https://travelplanner.example.com` | 200 OK | ☐ |
| 5 | HTTP redirects to HTTPS | `curl -I http://travelplanner.example.com` | 301 Moved Permanently | ☐ |
| 6 | API health check | `curl https://travelplanner.example.com/health` | `{"success":true}` | ☐ |
| 7 | API returns data | `curl https://travelplanner.example.com/api/destinations` | 200 + JSON array | ☐ |
| 8 | API rejects unauthenticated | `curl https://travelplanner.example.com/api/trips` | 401 | ☐ |
| 9 | SSL certificate valid | `curl -vI https://travelplanner.example.com 2>&1 \| grep "SSL certificate"` | verified OK | ☐ |
| 10 | Firewall allows only 22/80/443 | `sudo ufw status` | ALLOW on 22,80,443 only | ☐ |
| 11 | Frontend loads | Open browser to `https://travelplanner.example.com` | React app renders | ☐ |
| 12 | Login flow works | Login with test credentials | Success + redirect | ☐ |
| 13 | No errors in logs | `pm2 logs travelapp-api --lines 50` | No 500 errors | ☐ |
| 14 | Database accessible | `PGPASSWORD='...' psql -U travelapp_user -d travelapp_prod -c '\dt'` | 10+ tables listed | ☐ |
| 15 | CORS configured | `curl -H "Origin: https://evil.com" -I https://travelplanner.example.com/api/destinations` | No Access-Control-Allow-Origin | ☐ |

### 15.2 Automated Verification Script

```bash
cat > ~/travelapp/verify-deployment.sh << 'VERIFYSCRIPT'
#!/bin/bash
# Travel Planner — Deployment Verification Script

DOMAIN="travelplanner.example.com"
FAIL=0
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "=== Travel Planner Deployment Verification ==="
echo "Domain: $DOMAIN"
echo ""

# 1. Nginx
echo -n "1. Nginx status... "
if systemctl is-active --quiet nginx; then echo -e "${GREEN}PASS${NC}"; else echo -e "${RED}FAIL${NC}"; FAIL=$((FAIL+1)); fi

# 2. PostgreSQL
echo -n "2. PostgreSQL status... "
if systemctl is-active --quiet postgresql; then echo -e "${GREEN}PASS${NC}"; else echo -e "${RED}FAIL${NC}"; FAIL=$((FAIL+1)); fi

# 3. PM2
echo -n "3. PM2 process... "
if pm2 pid travelapp-api > /dev/null 2>&1; then echo -e "${GREEN}PASS${NC}"; else echo -e "${RED}FAIL${NC}"; FAIL=$((FAIL+1)); fi

# 4. HTTPS
echo -n "4. HTTPS response... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN" --connect-timeout 5)
if [ "$HTTP_CODE" = "200" ]; then echo -e "${GREEN}PASS${NC} ($HTTP_CODE)"; else echo -e "${RED}FAIL${NC} (HTTP $HTTP_CODE)"; FAIL=$((FAIL+1)); fi

# 5. HTTP redirect
echo -n "5. HTTP redirect... "
REDIRECT_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://$DOMAIN" --connect-timeout 5)
if [ "$REDIRECT_CODE" = "301" ] || [ "$REDIRECT_CODE" = "302" ]; then echo -e "${GREEN}PASS${NC} ($REDIRECT_CODE)"; else echo -e "${RED}FAIL${NC} (HTTP $REDIRECT_CODE)"; FAIL=$((FAIL+1)); fi

# 6. Health check
echo -n "6. Health endpoint... "
HEALTH=$(curl -s "https://$DOMAIN/health" --connect-timeout 5)
if echo "$HEALTH" | grep -q '"success":true'; then echo -e "${GREEN}PASS${NC}"; else echo -e "${RED}FAIL${NC}"; FAIL=$((FAIL+1)); fi

# 7. API data
echo -n "7. API destinations... "
DEST_COUNT=$(curl -s "https://$DOMAIN/api/destinations" --connect-timeout 5 | grep -o '"destination_id"' | wc -l)
if [ "$DEST_COUNT" -gt 0 ]; then echo -e "${GREEN}PASS${NC} ($DEST_COUNT destinations)"; else echo -e "${RED}FAIL${NC}"; FAIL=$((FAIL+1)); fi

# 8. Auth required
echo -n "8. Auth enforcement... "
AUTH_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN/api/trips" --connect-timeout 5)
if [ "$AUTH_CODE" = "401" ]; then echo -e "${GREEN}PASS${NC} (401)"; else echo -e "${RED}FAIL${NC} (HTTP $AUTH_CODE)"; FAIL=$((FAIL+1)); fi

# 9. SSL validity
echo -n "9. SSL certificate... "
SSL_DAYS=$(echo | openssl s_client -connect "$DOMAIN:443" -servername "$DOMAIN" 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
if [ -n "$SSL_DAYS" ]; then echo -e "${GREEN}PASS${NC} (expires: $SSL_DAYS)"; else echo -e "${RED}FAIL${NC}"; FAIL=$((FAIL+1)); fi

# 10. Firewall
echo -n "10. Firewall... "
FW_STATUS=$(sudo ufw status | grep -c "active")
if [ "$FW_STATUS" -gt 0 ]; then echo -e "${GREEN}PASS${NC}"; else echo -e "${RED}FAIL${NC}"; FAIL=$((FAIL+1)); fi

echo ""
if [ "$FAIL" -eq 0 ]; then
    echo -e "${GREEN}All checks passed!${NC}"
else
    echo -e "${RED}$FAIL check(s) failed.${NC}"
fi
VERIFYSCRIPT

chmod +x ~/travelapp/verify-deployment.sh
```

---

## 16. Rollback Strategy

### 16.1 Application Rollback

```bash
# Quick rollback to previous PM2 process
cd ~/travelapp/backend

# Option A: Rollback code changes
git stash
git checkout <PREVIOUS_STABLE_COMMIT>

# Option B: Use previous backup
cp -r ~/travelapp/backend.bak/* ~/travelapp/backend/

# Reinstall dependencies
npm ci --only=production

# Restart application
pm2 restart travelapp-api --update-env
```

### 16.2 Database Rollback

```bash
# List available backups
ls -la /var/backups/travelapp/

# Restore specific backup
PGPASSWORD='<PROD_DB_PASSWORD>' pg_restore \
  -h localhost \
  -U travelapp_user \
  -d travelapp_prod \
  --clean \
  --if-exists \
  /var/backups/travelapp/travelapp_prod_20260723_020000.dump.gz

# Drop and recreate for full restore
PGPASSWORD='<PROD_DB_PASSWORD>' dropdb -h localhost -U travelapp_user travelapp_prod
PGPASSWORD='<PROD_DB_PASSWORD>' createdb -h localhost -U travelapp_user travelapp_prod
gunzip -c /var/backups/travelapp/travelapp_prod_20260723_020000.dump.gz | \
  PGPASSWORD='<PROD_DB_PASSWORD>' pg_restore -h localhost -U travelapp_user -d travelapp_prod
```

### 16.3 Nginx Rollback

```bash
# Restore previous Nginx configuration
sudo cp /etc/nginx/sites-available/travelplanner.bak /etc/nginx/sites-available/travelplanner
sudo nginx -t && sudo systemctl reload nginx
```

### 16.4 Full Server Snapshot (Before Major Changes)

```bash
# Before any major deployment, take a filesystem backup
sudo tar -czf /var/backups/travelapp/fs_backup_$(date +%Y%m%d).tar.gz \
  /home/deploy/travelapp \
  /etc/nginx/sites-available/travelplanner \
  /etc/nginx/nginx.conf \
  /etc/postgresql/*/main/postgresql.conf \
  /etc/postgresql/*/main/pg_hba.conf
```

---

## 17. Troubleshooting Guide

### 17.1 Application Won't Start

**Symptom:** `pm2 status` shows `errored` or `stopped`

**Troubleshooting steps:**

```bash
# Check error logs
pm2 logs travelapp-api --lines 50

# Common causes and fixes:

# 1. Port already in use
sudo lsof -i :5000
# Fix: kill the process or change PORT in .env

# 2. Database connection failure
# Verify DATABASE_URL in .env is correct
# Test connection:
PGPASSWORD='<PASSWORD>' psql -h localhost -U travelapp_user -d travelapp_prod -c '\conninfo'

# 3. Missing .env file
ls -la ~/travelapp/backend/.env

# 4. Missing dependencies
cd ~/travelapp/backend && npm ci --only=production

# 5. Syntax error in application code
cd ~/travelapp/backend && node -e "require('./src/app.js')"
```

### 17.2 Database Connection Refused

**Symptom:** `psql: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused`

**Troubleshooting:**

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check PostgreSQL port
sudo ss -tuln | grep 5432

# Verify pg_hba.conf allows local connections
sudo cat /etc/postgresql/*/main/pg_hba.conf | grep -v '^#' | grep -v '^$'

# Restart PostgreSQL
sudo systemctl restart postgresql

# Check PostgreSQL logs
sudo journalctl -u postgresql -n 50 --no-pager
```

### 17.3 Nginx 502 Bad Gateway

**Symptom:** Browser shows `502 Bad Gateway` for API routes

**Troubleshooting:**

```bash
# Check if backend is running
pm2 status

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Common fixes:
# 1. Backend not started → pm2 start travelapp-api
# 2. Backend port mismatch → verify PORT in .env matches upstream in nginx config
# 3. Permissions → sudo chmod 755 /home/deploy (parent dirs must be executable)
```

### 17.4 Nginx 403 Forbidden

**Symptom:** Browser shows `403 Forbidden` for frontend routes

**Troubleshooting:**

```bash
# Check Nginx user can access the files
sudo -u www-data ls -la ~/travelapp/frontend/build/index.html
# Fix: sudo chown -R www-data:www-data ~/travelapp/frontend/build

# Check parent directory permissions
sudo -u www-data ls -la ~/travelapp/frontend/
# Parent dirs need +x for www-data: sudo chmod +x /home/deploy /home/deploy/travelapp /home/deploy/travelapp/frontend
```

### 17.5 SSL Certificate Issues

**Symptom:** Browser shows "Not Secure" or certificate error

**Troubleshooting:**

```bash
# Check certificate expiration
sudo certbot certificates

# Force renewal (if expired or misconfigured)
sudo certbot renew --force-renewal

# Re-run Certbot with correct domain
sudo certbot --nginx -d travelplanner.example.com

# Test SSL configuration
openssl s_client -connect travelplanner.example.com:443 -servername travelplanner.example.com
```

### 17.6 High Memory Usage

**Symptom:** Server running out of memory, PM2 process killed

**Troubleshooting:**

```bash
# Check current memory usage
free -h
pm2 status

# Check PostgreSQL memory
sudo ps aux | grep postgres

# Solutions:
# 1. Reduce PostgreSQL shared_buffers in postgresql.conf
# 2. Reduce PM2 max_memory_restart
# 3. Add swap space:
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 17.7 PM2 Process List Lost After Reboot

**Symptom:** After server restart, `pm2 status` shows no processes

**Troubleshooting:**

```bash
# Re-save the process list
cd ~/travelapp
pm2 start ecosystem.config.js
pm2 save

# Verify startup script is installed
pm2 startup systemd -u deploy --hp /home/deploy
# Execute the displayed sudo command

# Test by rebooting: sudo reboot
```

### 17.8 CORS Errors in Browser

**Symptom:** Browser console shows "Cross-Origin Request Blocked"

**Troubleshooting:**

```bash
# Verify CORS_ORIGIN in backend .env
cat ~/travelapp/backend/.env | grep CORS_ORIGIN

# Check Nginx is not adding duplicate CORS headers
curl -s -D - -o /dev/null -H "Origin: https://travelplanner.example.com" https://travelplanner.example.com/api/destinations | grep -i access-control

# Ensure the frontend VITE_API_BASE_URL matches the production domain
cat ~/travelapp/frontend/.env
```

---

## Appendix A: Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NODE_ENV` | Runtime environment | Yes | `production` |
| `PORT` | Backend server port | Yes | `5000` |
| `DATABASE_URL` | PostgreSQL connection string | Yes | `postgresql://user:pass@localhost:5432/travelapp_prod` |
| `JWT_SECRET` | JWT signing secret (64+ chars) | Yes | `openssl rand -base64 64` |
| `JWT_EXPIRES_IN` | Token expiration duration | Yes | `7d` |
| `CORS_ORIGIN` | Allowed CORS origins (comma-separated) | Yes | `https://travelplanner.example.com` |
| `LOG_FORMAT` | Morgan log format | No | `combined` |

### Frontend (`frontend/.env`)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_API_BASE_URL` | API base URL (embedded at build time) | Yes | `https://travelplanner.example.com/api` |

---

## Appendix B: Port Reference

| Port | Service | Protocol | Firewall | Notes |
|------|---------|----------|----------|-------|
| 22 | SSH | TCP | Open | Admin access (consider non-standard) |
| 80 | HTTP | TCP | Open | Redirects to HTTPS |
| 443 | HTTPS | TCP | Open | Production traffic |
| 5432 | PostgreSQL | TCP | Closed | Localhost only |
| 5000 | Express API | TCP | Closed | Localhost only (Nginx reverse proxy) |

---

## Appendix C: Key File Locations

| Component | Path |
|-----------|------|
| Backend code | `/home/deploy/travelapp/backend/src/` |
| Backend env | `/home/deploy/travelapp/backend/.env` |
| Backend logs | `/home/deploy/travelapp/backend/logs/` |
| Frontend build | `/home/deploy/travelapp/frontend/build/` |
| Frontend env (build) | `/home/deploy/travelapp/frontend/.env` |
| PM2 config | `/home/deploy/travelapp/ecosystem.config.js` |
| Nginx site config | `/etc/nginx/sites-available/travelplanner` |
| Nginx enabled site | `/etc/nginx/sites-enabled/travelplanner` |
| SSL certificate | `/etc/letsencrypt/live/travelplanner.example.com/` |
| DB backups | `/var/backups/travelapp/` |
| DB backup script | `/usr/local/bin/backup-travelapp-db` |
| Verify script | `/home/deploy/travelapp/verify-deployment.sh` |

---

## Appendix D: Useful Aliases

```bash
cat >> ~/.bash_aliases << 'ALIASES'
# Travel Planner Deployment Aliases
alias tp-status='pm2 status'
alias tp-logs='pm2 logs travelapp-api'
alias tp-restart='pm2 restart travelapp-api'
alias tp-stop='pm2 stop travelapp-api'
alias tp-start='pm2 start /home/deploy/travelapp/ecosystem.config.js'
alias tp-nginx-test='sudo nginx -t'
alias tp-nginx-reload='sudo systemctl reload nginx'
alias tp-db-conn='PGPASSWORD="<PROD_DB_PASSWORD>" psql -h localhost -U travelapp_user -d travelapp_prod'
alias tp-backup='sudo /usr/local/bin/backup-travelapp-db'
alias tp-verify='~/travelapp/verify-deployment.sh'
ALIASES
source ~/.bash_aliases
```

---

## Appendix E: Security Compliance Checklist

| Requirement | Standard | Implementation |
|-------------|----------|---------------|
| HTTPS enforced | OWASP A5 | Nginx 301 redirect + Certbot |
| HSTS headers | OWASP | `Strict-Transport-Security` header |
| XSS protection | OWASP A7 | `X-XSS-Protection` header + helmet() |
| CSRF protection | OWASP A8 | JWT token in Authorization header |
| SQL injection prevention | OWASP A1 | Parameterized queries (pg driver) |
| Rate limiting | OWASP | express-rate-limit on auth routes |
| Body size limit | OWASP | `express.json({ limit: '1mb' })` |
| No stack traces in prod | OWASP A6 | `error.middleware.js` production check |
| Secure HTTP headers | OWASP | helmet() middleware |
| CORS scoping | OWASP | Whitelist origins in CORS_ORIGIN |
| Password hashing | OWASP A2 | bcryptjs |
| Firewall | CIS | UFW (allow 22,80,443 only) |
| Fail2ban | CIS | SSH + Nginx brute force protection |
| SSL/TLS modern profile | Mozilla | TLSv1.2 + TLSv1.3 only |
| Auto security updates | CIS | unattended-upgrades |
| SSH key-only auth | CIS | PasswordAuthentication no |
| Least privilege DB user | CIS | Dedicated user, no superuser |
| DB not network-exposed | CIS | listen_addresses = 'localhost' |
| Logging & monitoring | OWASP | Morgan + PM2 + Nginx logs |
| Dependency auditing | OWASP | `npm audit` in CI/CD |

---

*Document prepared by DevOps Engineering for production deployment of the Travel Planner application. This guide follows enterprise-grade standards for security, reliability, and maintainability.*