# Quick Setup Guide

## Prerequisites
- PHP 8.2+ with Composer
- Node.js 16+ with npm
- PostgreSQL database (or MySQL/SQLite)

## Backend Setup (Laravel)

1. **Navigate to backend directory:**
   ```bash
   cd laundry-backend
   ```

2. **Install PHP dependencies:**
   ```bash
   composer install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure database in `.env`:**
   ```env
   DB_CONNECTION=pgsql  # or mysql/sqlite
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=your_database_name
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

5. **Generate application key:**
   ```bash
   php artisan key:generate
   ```

6. **Run migrations:**
   ```bash
   php artisan migrate
   ```

7. **Run seeders (optional - creates admin user):**
   ```bash
   php artisan db:seed
   ```

8. **Start Laravel server:**
   ```bash
   php artisan serve
   ```
   Backend will run on `http://localhost:8000`

## Frontend Setup (React)

1. **Navigate to frontend directory:**
   ```bash
   cd laundry-frontend
   ```

2. **Install Node dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```env
   REACT_APP_API_URL=http://localhost:8000
   REACT_APP_OPENWEATHER_API_KEY=your_openweather_api_key
   ```

4. **Start React development server:**
   ```bash
   npm start
   ```
   Frontend will run on `http://localhost:3000`

## Default Admin Credentials
- **Email:** admin@laundry.com
- **Password:** admin123

## Notes
- Make sure your database is created before running migrations
- For PostgreSQL, ensure the database and user exist
- The backend and frontend must run simultaneously
- Update `REACT_APP_API_URL` in frontend `.env` if backend runs on a different port

