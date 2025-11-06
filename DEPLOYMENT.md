# Deployment Guide: WASHNET Laundry Management System

This guide will help you deploy the backend to Render (with PostgreSQL) and the frontend to Vercel.

## Prerequisites

- GitHub account
- Render account (sign up at https://render.com)
- Vercel account (sign up at https://vercel.com)
- Git installed on your local machine

---

## Part 1: Deploy Backend to Render

### Quick Setup

For detailed step-by-step instructions, see **`RENDER_SETUP_GUIDE.md`**

### Summary Steps:

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create PostgreSQL Database**
   - New → PostgreSQL
   - Choose free plan
   - Note database credentials

3. **Create Web Service**
   - New → Web Service
   - Connect GitHub repo
   - Set root directory: `laundry-backend`
   - Build command: `composer install --no-dev --optimize-autoloader && php artisan config:cache && php artisan route:cache && php artisan view:cache`
   - Start command: `php artisan serve --host=0.0.0.0 --port=$PORT`

4. **Configure Environment Variables**
   - Add all required variables (see RENDER_SETUP_GUIDE.md)
   - Link PostgreSQL database or enter credentials manually

5. **Generate APP_KEY and Run Migrations**
   - Use Render Shell to run migrations
   - Generate app key locally or in shell

6. **Get Backend URL**
   - Your service URL: `https://your-service-name.onrender.com`

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
   - Ensure database service is running in Render
   - Try linking database resource instead of manual setup

2. **CORS Errors**
   - Verify `FRONTEND_URL` matches your Vercel URL exactly (no trailing slash)
   - Clear browser cache
   - Check Render logs for errors

3. **500 Errors**
   - Check Render logs: Service → Logs tab
   - Verify `APP_KEY` is set
   - Check that migrations have run successfully

4. **Service Sleeping (Free Plan)**
   - Free Render services sleep after 15 minutes of inactivity
   - First request after sleep takes ~30 seconds
   - Consider upgrading for always-on service

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

### Backend (Render)

| Variable | Description | Example |
|----------|-------------|---------|
| `APP_URL` | Backend URL | `https://your-app.onrender.com` |
| `FRONTEND_URL` | Frontend URL | `https://your-app.vercel.app` |
| `DB_CONNECTION` | Database type | `pgsql` |
| `DB_HOST` | Database host | From Render database settings |
| `DB_DATABASE` | Database name | From Render database settings |
| `DB_USERNAME` | Database user | From Render database settings |
| `DB_PASSWORD` | Database password | From Render database settings |

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

