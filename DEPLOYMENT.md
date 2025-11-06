# Deployment Guide: WASHNET Laundry Management System

This guide will help you deploy the backend to Railway (with PostgreSQL) and the frontend to Vercel.

## Prerequisites

- GitHub account
- Railway account (sign up at https://railway.app)
- Vercel account (sign up at https://vercel.com)
- Git installed on your local machine

---

## Part 1: Deploy Backend to Railway

### Step 1: Push Code to GitHub

1. Make sure all your changes are committed:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin master
   ```

### Step 2: Create PostgreSQL Database on Railway

1. Go to https://railway.app and sign in
2. Click **"New Project"**
3. Select **"Empty Project"**
4. Click **"New"** → **"Database"** → **"Add PostgreSQL"**
5. Wait for the database to be provisioned
6. Click on the PostgreSQL service
7. Go to the **"Variables"** tab
8. **Copy these values** (you'll need them later):
   - `PGHOST`
   - `PGPORT`
   - `PGDATABASE`
   - `PGUSER`
   - `PGPASSWORD`

### Step 3: Deploy Laravel Backend to Railway

1. In the same Railway project, click **"New"** → **"GitHub Repo"**
2. Select your repository: `remaruru/WASHNET-Others`
3. Select the **`laundry-backend`** directory as the root directory (or create a new service)
4. Railway will automatically detect it's a PHP/Laravel project

### Step 4: Configure Backend Environment Variables

1. Click on your backend service
2. Go to the **"Variables"** tab
3. Click **"New Variable"** and add the following:

```env
# App Configuration
APP_NAME=WASHNET
APP_ENV=production
APP_KEY=base64:YOUR_APP_KEY_HERE
APP_DEBUG=false
APP_URL=https://your-backend-service.railway.app

# Database Configuration (use the PostgreSQL values from Step 2)
DB_CONNECTION=pgsql
DB_HOST=${PGHOST}
DB_PORT=${PGPORT}
DB_DATABASE=${PGDATABASE}
DB_USERNAME=${PGUSER}
DB_PASSWORD=${PGPASSWORD}

# Frontend URL (update after deploying frontend)
FRONTEND_URL=https://your-frontend.vercel.app

# Session & Cache
SESSION_DRIVER=database
CACHE_DRIVER=database
QUEUE_CONNECTION=database

# Logging
LOG_CHANNEL=stderr
LOG_LEVEL=error
```

**Important Notes:**
- Replace `APP_KEY` with your Laravel app key (run `php artisan key:generate` locally and copy the key)
- Replace `APP_URL` with your Railway backend URL (will be generated after deployment)
- Replace `FRONTEND_URL` with your Vercel frontend URL (update after deploying frontend)

### Step 5: Generate App Key and Run Migrations

1. In Railway, go to your backend service
2. Click on **"Settings"** → **"Deploy"**
3. Add a **"Deploy Command"**:
   ```bash
   php artisan key:generate --force && php artisan migrate --force && php artisan db:seed --force
   ```
4. Or manually run via Railway's console:
   - Go to your service → **"Deployments"** → Click on the latest deployment
   - Open **"View Logs"** → Click **"Open Shell"**
   - Run:
     ```bash
     php artisan key:generate --force
     php artisan migrate --force
     php artisan db:seed --force
     ```

### Step 6: Get Your Backend URL

1. After deployment, go to your backend service
2. Click **"Settings"** → **"Domains"**
3. Copy your Railway-provided URL (e.g., `https://your-app-name.up.railway.app`)
4. **Save this URL** - you'll need it for the frontend configuration

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### Step 2: Deploy via Vercel Dashboard

1. Go to https://vercel.com and sign in with GitHub
2. Click **"Add New"** → **"Project"**
3. Import your repository: `remaruru/WASHNET-Others`
4. Configure the project:
   - **Root Directory**: `laundry-frontend`
   - **Framework Preset**: `Create React App`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### Step 3: Configure Frontend Environment Variables

1. In your Vercel project settings, go to **"Environment Variables"**
2. Add the following variables:

```env
REACT_APP_API_URL=https://your-backend-url.railway.app
REACT_APP_OPENWEATHER_API_KEY=your_openweather_api_key_here
```

**Important:**
- Replace `your-backend-url.railway.app` with your actual Railway backend URL from Part 1, Step 6
- Replace `your_openweather_api_key_here` with your OpenWeatherMap API key

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for the deployment to complete
3. Vercel will provide you with a URL (e.g., `https://your-app.vercel.app`)

---

## Part 3: Connect Backend and Frontend

### Step 1: Update Backend CORS Settings

1. Go back to Railway → Your Backend Service → Variables
2. Update the `FRONTEND_URL` variable with your Vercel URL:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. Redeploy the backend (Railway will auto-redeploy when you update variables)

### Step 2: Test the Connection

1. Visit your Vercel frontend URL
2. Try logging in or creating an order
3. Check the browser console for any CORS errors
4. If you see CORS errors, verify that:
   - `FRONTEND_URL` in Railway matches your Vercel URL exactly
   - Backend has been redeployed after updating `FRONTEND_URL`

---

## Part 4: Database Migration and Seeding

### Run Migrations on Railway

1. In Railway, open your backend service
2. Go to **"Deployments"** → Latest deployment → **"View Logs"**
3. Click **"Open Shell"**
4. Run:
   ```bash
   php artisan migrate --force
   php artisan db:seed --force
   ```

This will:
- Create all database tables
- Seed the admin user (check your `AdminSeeder.php` for credentials)

---

## Troubleshooting

### Backend Issues

1. **Database Connection Errors**
   - Verify all PostgreSQL environment variables are set correctly
   - Check that `DB_CONNECTION=pgsql` is set
   - Ensure database service is running in Railway

2. **CORS Errors**
   - Verify `FRONTEND_URL` matches your Vercel URL exactly (no trailing slash)
   - Clear browser cache
   - Check Railway logs for errors

3. **500 Errors**
   - Check Railway logs: Service → Deployments → View Logs
   - Verify `APP_KEY` is set
   - Check that migrations have run successfully

### Frontend Issues

1. **API Connection Errors**
   - Verify `REACT_APP_API_URL` is set correctly in Vercel
   - Check that it matches your Railway backend URL
   - Redeploy frontend after changing environment variables

2. **Build Errors**
   - Check Vercel build logs
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

---

## Environment Variables Reference

### Backend (Railway)

| Variable | Description | Example |
|----------|-------------|---------|
| `APP_URL` | Backend URL | `https://your-app.railway.app` |
| `FRONTEND_URL` | Frontend URL | `https://your-app.vercel.app` |
| `DB_CONNECTION` | Database type | `pgsql` |
| `DB_HOST` | Database host | `${PGHOST}` |
| `DB_DATABASE` | Database name | `${PGDATABASE}` |
| `DB_USERNAME` | Database user | `${PGUSER}` |
| `DB_PASSWORD` | Database password | `${PGPASSWORD}` |

### Frontend (Vercel)

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `https://your-app.railway.app` |
| `REACT_APP_OPENWEATHER_API_KEY` | Weather API key | `your_key_here` |

---

## Additional Notes

- **Railway** provides a free tier with $5 credit/month
- **Vercel** provides a free tier for hobby projects
- Always keep your `.env` files local and never commit them to Git
- Update environment variables in production through the platform dashboards
- Monitor your Railway usage to avoid unexpected charges

---

## Success Checklist

- [ ] Backend deployed to Railway
- [ ] PostgreSQL database created and connected
- [ ] Environment variables configured in Railway
- [ ] Migrations and seeds run successfully
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured in Vercel
- [ ] Backend CORS updated with frontend URL
- [ ] Tested login functionality
- [ ] Tested order creation
- [ ] Tested API endpoints from frontend

---

## Need Help?

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Laravel Docs: https://laravel.com/docs

Good luck with your deployment! 🚀

