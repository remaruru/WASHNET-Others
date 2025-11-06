FROM php:8.2-cli

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy application files
COPY . /var/www/html

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Create entrypoint script
RUN echo '#!/bin/bash\n\
set -e\n\
echo "Creating .env file from environment variables..."\n\
if [ ! -f .env ]; then\n\
  touch .env\n\
  echo "APP_NAME=${APP_NAME:-Laravel}" >> .env\n\
  echo "APP_ENV=${APP_ENV:-production}" >> .env\n\
  echo "APP_KEY=${APP_KEY:-}" >> .env\n\
  echo "APP_DEBUG=${APP_DEBUG:-false}" >> .env\n\
  echo "APP_URL=${APP_URL:-http://localhost}" >> .env\n\
  echo "DB_CONNECTION=${DB_CONNECTION:-pgsql}" >> .env\n\
  echo "DB_HOST=${DB_HOST:-}" >> .env\n\
  echo "DB_PORT=${DB_PORT:-5432}" >> .env\n\
  echo "DB_DATABASE=${DB_DATABASE:-}" >> .env\n\
  echo "DB_USERNAME=${DB_USERNAME:-}" >> .env\n\
  echo "DB_PASSWORD=${DB_PASSWORD:-}" >> .env\n\
fi\n\
echo "Waiting for database connection..."\n\
until php artisan migrate:status > /dev/null 2>&1; do\n\
  echo "Database not ready, waiting..."\n\
  sleep 2\n\
done\n\
echo "Database is ready!"\n\
if [ -z "$APP_KEY" ] || grep -q "APP_KEY=$" .env || grep -q "^APP_KEY=$" .env; then\n\
  echo "Generating APP_KEY..."\n\
  php artisan key:generate --force\n\
  APP_KEY=$(grep "^APP_KEY=" .env | cut -d "=" -f2-)\n\
  echo "Generated APP_KEY: $APP_KEY"\n\
else\n\
  echo "APP_KEY already set"\n\
fi\n\
php artisan config:clear\n\
php artisan cache:clear\n\
echo "Running migrations..."\n\
php artisan migrate --force\n\
echo "Seeding database..."\n\
php artisan db:seed --force || true\n\
php artisan config:cache\n\
php artisan route:cache\n\
php artisan view:cache\n\
echo "Starting server..."\n\
exec php artisan serve --host=0.0.0.0 --port=${PORT:-8000}\n\
' > /entrypoint.sh && chmod +x /entrypoint.sh

# Expose port
EXPOSE 8000

# Use entrypoint script
ENTRYPOINT ["/entrypoint.sh"]

