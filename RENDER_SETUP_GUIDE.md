# Step-by-Step: Setting Up Backend on Render

This guide will walk you through deploying your Laravel backend to Render step by step.

---

## 📋 Prerequisites

- ✅ GitHub repository is pushed (your code is on GitHub)
- ✅ Render account (sign up at https://render.com - it's free!)

## ⚠️ Important Note About Render Shell

**Render does NOT support SSH access.** Instead, Render provides a web-based shell interface that you access through your browser. When you need to run commands (like migrations), you'll use:
- **Shell tab** in your service dashboard
- Click **"Connect"** or **"Open Shell"** button
- A web terminal opens in your browser
- This is fully functional for running commands like `php artisan migrate`

This is different from services like Railway or Heroku that might support SSH. Render's web shell is sufficient for all deployment tasks.

---

## 🚀 Step 1: Create Render Account & Connect Repository

### 1.1 Sign Up/Login
1. Go to https://render.com
2. Click **"Get Started for Free"** or **"Sign Up"**
3. Sign in with your **GitHub account** (recommended - easier to connect repo)
4. Complete email verification if prompted

### 1.2 Access Dashboard
- After logging in, you'll see the Render dashboard
- You're ready to create services!

---

## 🎯 Quick Deploy Option: Using render.yaml Blueprint

**This is the EASIEST way!** If you want to use the `render.yaml` file as a blueprint:

### Option A: Deploy from Blueprint (Recommended)
1. In Render dashboard, click **"+ New"** button
2. Select **"Blueprint"**
3. Connect your GitHub repository: `remaruru/WASHNET-Others`
4. Render will automatically detect the `render.yaml` file
5. Review the configuration (it will create both database and web service)
6. Click **"Apply"** or **"Deploy"**
7. Render will automatically:
   - Create PostgreSQL database
   - Create web service
   - Set up all environment variables
   - Deploy your backend

**You still need to:**
- Generate `APP_KEY` (see Step 5)
- Run migrations (see Step 6)
- Update `APP_URL` and `FRONTEND_URL` after deployment

**Then skip to Step 5 in the manual setup below!**

---

## 📝 Manual Setup (Alternative Method)

If you prefer to set up everything manually instead of using the blueprint:

---

## 🗄️ Step 2: Create PostgreSQL Database (Manual Setup)

### 2.1 Create Database
1. In Render dashboard, click **"+ New"** button (top right)
2. Select **"PostgreSQL"**
3. Configure your database:
   - **Name**: `washnet-db` (or any name you prefer)
   - **Database**: `washnet` (or leave default)
   - **User**: `washnet_user` (or leave default)
   - **Region**: Choose closest to you (e.g., `Oregon (US West)`)
   - **PostgreSQL Version**: Latest (default)
   - **Plan**: **Free** (for testing)
4. Click **"Create Database"**
5. Wait 1-2 minutes for Render to provision your database

### 2.2 Get Database Connection String
1. Once database is ready, click on it
2. You'll see the **"Connections"** section
3. **IMPORTANT:** Copy the **"Internal Database URL"** - you'll need it later
   - It looks like: `postgresql://user:password@host:5432/database`
4. Also note the individual values shown:
   - **Host**
   - **Port** (usually 5432)
   - **Database name**
   - **Username**
   - **Password**

**💡 Tip:** Keep this tab open - you'll need these values!

---

## 🔧 Step 3: Create Web Service (Backend) (Manual Setup)

### 3.1 Create New Web Service
1. In Render dashboard, click **"+ New"** button
2. Select **"Web Service"**
3. Connect your repository:
   - Click **"Connect account"** if not already connected
   - Authorize Render to access your GitHub
   - Select your repository: **`remaruru/WASHNET-Others`**
   - Click **"Connect"**

### 3.2 Configure Service
Fill in the service configuration:

**Basic Settings:**
- **Name**: `washnet-backend` (or any name)
- **Region**: Same as database (e.g., `Oregon (US West)`)
- **Branch**: `master` (or your main branch)
- **Root Directory**: `laundry-backend` ⚠️ **IMPORTANT!**
- **Runtime**: **PHP**
- **Build Command**: 
  ```bash
  composer install --no-dev --optimize-autoloader && php artisan config:cache && php artisan route:cache && php artisan view:cache
  ```
- **Start Command**:
  ```bash
  php artisan serve --host=0.0.0.0 --port=$PORT
  ```
- **Plan**: **Free** (for testing)

### 3.3 Advanced Settings (Optional)
- **Auto-Deploy**: `Yes` (deploy on every push to master)
- **Health Check Path**: `/up` (Laravel's health check)

Click **"Create Web Service"**

---

## ⚙️ Step 4: Configure Environment Variables (Manual Setup)

### 4.1 Access Environment Variables
1. After creating the service, you'll be redirected to the service page
2. Go to the **"Environment"** tab
3. Click **"Add Environment Variable"** for each variable

### 4.2 Add Required Variables
Add these one by one:

#### Basic App Configuration:
```
Key: APP_NAME
Value: WASHNET
```

```
Key: APP_ENV
Value: production
```

```
Key: APP_DEBUG
Value: false
```

#### App URL (Update after deployment):
```
Key: APP_URL
Value: https://your-service-name.onrender.com
```
**Note:** You'll get this URL after first deployment. Update it then.

#### Database Configuration:

**Option A: Using Individual Values (Recommended)**
```
Key: DB_CONNECTION
Value: pgsql
```

```
Key: DB_HOST
Value: [Use the Host from Step 2.2]
```

```
Key: DB_PORT
Value: 5432
```

```
Key: DB_DATABASE
Value: [Use the Database name from Step 2.2]
```

```
Key: DB_USERNAME
Value: [Use the Username from Step 2.2]
```

```
Key: DB_PASSWORD
Value: [Use the Password from Step 2.2]
```

**Option B: Using Connection String**
You can also use the Internal Database URL directly:
```
Key: DATABASE_URL
Value: [Paste the Internal Database URL from Step 2.2]
```

Then add:
```
Key: DB_CONNECTION
Value: pgsql
```

#### Application Key (Generate in Step 5):
```
Key: APP_KEY
Value: (Leave empty for now - we'll generate it in Step 5)
```

#### Frontend URL (Update after deploying frontend):
```
Key: FRONTEND_URL
Value: https://your-frontend.vercel.app
```
**Note:** Update this after you deploy frontend to Vercel.

#### Session & Cache:
```
Key: SESSION_DRIVER
Value: database
```

```
Key: CACHE_DRIVER
Value: database
```

```
Key: QUEUE_CONNECTION
Value: database
```

#### Logging:
```
Key: LOG_CHANNEL
Value: stderr
```

```
Key: LOG_LEVEL
Value: error
```

### 4.3 Link Database (Alternative Method)
Instead of manually entering database values, you can:
1. In your service page, scroll to **"Links"** section
2. Click **"Link Resource"**
3. Select your PostgreSQL database
4. Render will automatically add the database connection variables

---

## 🔑 Step 5: Generate Application Key

### Option A: Generate Locally (Recommended)
1. On your local machine, open terminal in the `laundry-backend` folder
2. Run:
   ```bash
   php artisan key:generate --show
   ```
3. Copy the output (it will look like: `base64:xxxxxxxxxxxxx...`)
4. Go back to Render → Your Service → **"Environment"** tab
5. Find `APP_KEY` variable
6. Click the edit icon (pencil)
7. Paste the key value
8. Click **"Save Changes"**

### Option B: Generate on Render (Web Shell)
1. Render → Your Service → **"Shell"** tab
2. Click **"Connect"** or **"Open Shell"** to open the web-based terminal
3. Navigate to your backend directory if needed:
   ```bash
   cd laundry-backend
   ```
4. Run:
   ```bash
   php artisan key:generate --force
   ```
5. The key will be shown in the output - copy it
6. Go to **"Environment"** tab → Find `APP_KEY` → Click edit → Paste the key → Save

**Note:** The key won't automatically be added to environment variables. You need to copy it from the shell output and add it manually.

---

## 🗃️ Step 6: Run Database Migrations

### 6.1 Access Render Shell
**Note:** Render doesn't support SSH. You'll use Render's web-based shell interface.

1. Render → Your Service → **"Shell"** tab (or look for "Shell" in the service dashboard)
2. Click **"Connect"** or **"Open Shell"** button
3. A web-based terminal will open in your browser
4. This terminal is connected to your service's environment

### 6.2 Run Migrations
**Important:** Make sure you're in the correct directory. The shell should automatically be in your service root.

In the Render web shell, run these commands one by one:

```bash
cd laundry-backend
php artisan migrate --force
```

Wait for it to complete (you'll see success messages), then:

```bash
php artisan db:seed --force
```

**Note:** If you get "command not found" errors, the shell might not be in the right directory. Try:
```bash
pwd  # Check current directory
ls   # List files to verify you're in the right place
```

This will:
- Create all database tables
- Seed the admin user (check your `AdminSeeder.php` for credentials)

### 6.3 Verify
You should see messages like:
- "Migration table created successfully"
- "Migrated: 2025_10_21_105354_create_orders_table"
- "Database seeded successfully"

---

## 🌐 Step 7: Get Your Backend URL

### 7.1 Find Your Domain
1. Render → Your Service → **"Settings"** tab
2. Scroll to **"Service Details"** section
3. You'll see your service URL: `https://your-service-name.onrender.com`
4. **Copy this URL** - this is your backend API URL!

### 7.2 Update APP_URL
1. Go to **"Environment"** tab
2. Find `APP_URL`
3. Click edit icon
4. Update to match your domain: `https://your-service-name.onrender.com`
5. Click **"Save Changes"**
6. Render will auto-redeploy

---

## ✅ Step 8: Test Your Backend

### 8.1 Test Health Endpoint
Open in browser:
```
https://your-service-name.onrender.com/up
```

Should return: `{"status":"ok"}`

### 8.2 Test API Endpoint
Open in browser:
```
https://your-service-name.onrender.com/api/orders/search?customer_name=test
```

Should return: `[]` (empty array, which is correct)

### 8.3 Test with cURL (Optional)
```bash
curl https://your-service-name.onrender.com/api/orders/search?customer_name=test
```

---

## 🔍 Step 9: Check Logs (If Issues)

### 9.1 View Logs
1. Render → Your Service → **"Logs"** tab
2. See real-time deployment and runtime logs
3. Look for errors (red text)

### 9.2 Common Issues:
- **"No application encryption key"** → Make sure `APP_KEY` is set
- **"Database connection failed"** → Check database variables
- **"500 Internal Server Error"** → Check logs for specific error
- **Build fails** → Check build logs, verify `composer.json` is valid

---

## 🔄 Step 10: Auto-Deploy Setup

### 10.1 Enable Auto-Deploy
1. Render → Your Service → **"Settings"** tab
2. Scroll to **"Auto-Deploy"** section
3. Make sure it's set to **"Yes"**
4. Now every push to your GitHub `master` branch will auto-deploy!

---

## 📝 Summary Checklist

After completing all steps, verify:

- [ ] PostgreSQL database created and running
- [ ] Web service created and deployed
- [ ] Root directory set to `laundry-backend`
- [ ] All environment variables set
- [ ] `APP_KEY` generated and set
- [ ] Database migrations run successfully
- [ ] Database seeds run successfully
- [ ] Backend URL obtained
- [ ] `APP_URL` updated with backend URL
- [ ] Health endpoint works (`/up`)
- [ ] API endpoint works (`/api/orders/search`)
- [ ] Auto-deploy enabled

---

## 🎯 Next Steps

After backend is working:

1. **Deploy Frontend to Vercel** (see DEPLOYMENT.md)
2. **Update `FRONTEND_URL`** in Render with your Vercel URL
3. **Update `REACT_APP_API_URL`** in Vercel with your Render backend URL
4. **Test the full application**

---

## 🆘 Troubleshooting

### Build Fails
- Check Render build logs (Logs tab)
- Verify `composer.json` is valid
- Ensure PHP version is 8.2+
- Check that root directory is correct (`laundry-backend`)

### Database Connection Error
- Verify PostgreSQL service is running
- Check database variables are correct
- Ensure `DB_CONNECTION=pgsql`
- Try using the "Link Resource" feature instead

### 500 Error
- Check Render logs
- Verify `APP_KEY` is set
- Check migrations completed
- Verify file permissions (storage/, bootstrap/cache/)

### Service Goes to Sleep (Free Plan)
- Free services on Render sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- Consider upgrading to paid plan for always-on service

### CORS Errors
- Verify `FRONTEND_URL` is set correctly
- Update after frontend is deployed
- No trailing slash in URL

---

## 💰 Render Free Tier Limits

- **Web Services**: Free tier available (sleeps after 15 min inactivity)
- **PostgreSQL**: Free tier available (90 days, then $7/month)
- **Bandwidth**: 100 GB/month free
- **Build Time**: 500 build minutes/month free

**Note:** For production, consider upgrading to paid plans for:
- Always-on service (no sleep)
- Persistent database (no 90-day limit)
- More resources

---

## 📞 Need Help?

1. Check Render logs first
2. Verify all environment variables
3. Test database connection separately
4. Check Render documentation: https://render.com/docs
5. Share specific error messages

Your backend should now be live on Render! 🎉

