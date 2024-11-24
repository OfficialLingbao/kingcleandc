#!/bin/bash

# Configuration
BACKUP_DIR="/path/to/backups"
WEBSITE_DIR="/path/to/website"
DB_USER="your_db_user"
DB_PASS="your_db_password"
DB_NAME="your_db_name"
DATE=$(date +%Y-%m-%d_%H-%M-%S)

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Backup website files
echo "Backing up website files..."
tar -czf "$BACKUP_DIR/website_$DATE.tar.gz" "$WEBSITE_DIR"

# Backup database
echo "Backing up database..."
mysqldump -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$BACKUP_DIR/database_$DATE.sql"

# Compress database backup
gzip "$BACKUP_DIR/database_$DATE.sql"

# Delete backups older than 30 days
find "$BACKUP_DIR" -type f -mtime +30 -delete

echo "Backup completed successfully!"
