# Quick Start: Deployment Checklist

## ✅ Pre-Deployment Checklist

- [x] Frontend uses API_ENDPOINTS configuration
- [x] Backend CORS configured
- [x] Environment variables setup ready
- [x] Railway configuration files created
- [x] Vercel configuration created

---

## 🚀 Step-by-Step Deployment

### 1. Backend Deployment (Railway)

**Time: ~15 minutes**

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create PostgreSQL Database**
   - New Project → Empty Project
   - New → Database → PostgreSQL
   - Copy database credentials

3. **Deploy Backend**
   - New → GitHub Repo
   - Select your repo
   - Set root directory: `laundry-backend`
   - Add environment variables (see DEPLOYMENT.md)

4. **Run Migrations**
   - Use Railway shell or deploy command
   - `php artisan migrate --force`
   - `php artisan db:seed --force`

5. **Copy Backend URL**
   - Settings → Domains
   - Copy the Railway URL

---

### 2. Frontend Deployment (Vercel)

**Time: ~10 minutes**

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Add New → Project
   - Import `remaruru/WASHNET-Others`
   - Set root directory: `laundry-frontend`

3. **Configure Environment Variables**
   ```
   REACT_APP_API_URL=https://your-backend.railway.app
   REACT_APP_OPENWEATHER_API_KEY=your_key_here
   ```

4. **Deploy**
   - Click Deploy
   - Wait for build to complete
   - Copy Vercel URL

---

### 3. Connect Them Together

1. **Update Backend CORS**
   - Railway → Backend Service → Variables
   - Set `FRONTEND_URL=https://your-frontend.vercel.app`
   - Backend will auto-redeploy

2. **Test**
   - Visit your Vercel URL
   - Try logging in
   - Check browser console for errors

---

## 🔑 Important URLs to Save

- **Backend URL**: `https://your-app.railway.app`
- **Frontend URL**: `https://your-app.vercel.app`
- **Database**: (credentials in Railway)

---

## 📝 Environment Variables Needed

### Railway (Backend)
```
APP_URL=https://your-backend.railway.app
FRONTEND_URL=https://your-frontend.vercel.app
DB_CONNECTION=pgsql
DB_HOST=${PGHOST}
DB_PORT=${PGPORT}
DB_DATABASE=${PGDATABASE}
DB_USERNAME=${PGUSER}
DB_PASSWORD=${PGPASSWORD}
```

### Vercel (Frontend)
```
REACT_APP_API_URL=https://your-backend.railway.app
REACT_APP_OPENWEATHER_API_KEY=your_key_here
```

---

## 🐛 Common Issues

**CORS Errors?**
- Check `FRONTEND_URL` in Railway matches Vercel URL exactly
- No trailing slashes!

**Database Errors?**
- Verify PostgreSQL variables use `${PGHOST}`, `${PGUSER}`, etc.
- Check database service is running

**Build Fails?**
- Check Vercel build logs
- Verify all dependencies in package.json
- Check Node.js version

---

## 📚 Full Documentation

See `DEPLOYMENT.md` for detailed instructions.

---

## ✨ Next Steps After Deployment

1. Test all features
2. Update admin password
3. Set up custom domains (optional)
4. Configure monitoring (optional)
5. Set up backups (optional)

Good luck! 🎉

