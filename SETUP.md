# Quick Setup Guide

## Prerequisites
- PHP 8.2+ with Composer
- Node.js 16+ with npm
- MySQL database

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

4. **Generate application key:**
   ```bash
   php artisan key:generate
   ```

5. **Run migrations:**
   ```bash
   php artisan migrate
   ```

6. **Run seeders (optional - creates admin user):**
   ```bash
   php artisan db:seed
   ```

7. **Start Laravel server:**
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
- Make sure your MySQL database is created before running migrations
- The backend and frontend must run simultaneously
- Update `REACT_APP_API_URL` in frontend `.env` if backend runs on a different port

